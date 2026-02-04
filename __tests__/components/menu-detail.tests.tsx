
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MenuDetail } from "@/app/dashboard/menu/[id]/components/menu-detail-components/menu-detail";
import { useMenuDetail } from "@/hooks/use-menu-detail";
import { EditForm } from "@/app/dashboard/menu/[id]/components/menu-detail-components/edit-form";

// Mock the hook
jest.mock("@/hooks/use-menu-detail", () => ({
  useMenuDetail: jest.fn(),
}));

// Mock useRouter since MenuNotFound uses it (indirectly, although we mock MenuNotFound below, it's safer)
// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock MenuNotFound to simplify testing
jest.mock("@/app/dashboard/menu/[id]/components/menu-detail-components/menu-not-found", () => ({
  MenuNotFound: () => <div>Menu Not Found Component</div>,
}));

describe("MenuDetail Component", () => {
  const mockUseMenuDetail = useMenuDetail as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      refresh: jest.fn(),
    });
  });

  it("renders loading state correctly", () => {
    mockUseMenuDetail.mockReturnValue({
      menu: null,
      isLoading: true,
    });

    const { container } = render(<MenuDetail menuId="123" />);
    // Check for the loader spinner
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders not found state correctly", () => {
    mockUseMenuDetail.mockReturnValue({
      menu: null,
      isLoading: false,
    });

    render(<MenuDetail menuId="123" />);
    expect(screen.getByText("Menu Not Found Component")).toBeInTheDocument();
  });

  it("renders menu details correctly when data is present", () => {
    const mockMenu = {
      id: "1",
      name: "Nasi Goreng",
      imageUrl: "/img.jpg",
      category: { name: "Main Course" },
      price: 25000,
      description: "Enak sekali",
      ingredients: ["Nasi", "Telur", "Kecap"],
    };

    mockUseMenuDetail.mockReturnValue({
      menu: mockMenu,
      isLoading: false,
    });

    render(<MenuDetail menuId="1" />);

    expect(screen.getByText("Nasi Goreng")).toBeInTheDocument();
    expect(screen.getByText("Main Course")).toBeInTheDocument();
    // Price formatting: Rp 25.000
    // We use a flexible regex because locale spaces might vary (non-breaking space vs normal space)
    expect(screen.getByText(/Rp\s*25\.000/)).toBeInTheDocument();
    expect(screen.getByText("Enak sekali")).toBeInTheDocument();
    expect(screen.getByText("Nasi")).toBeInTheDocument();
    expect(screen.getByText("Telur")).toBeInTheDocument();
    expect(screen.getByText("Kecap")).toBeInTheDocument();

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/img.jpg");
    expect(img).toHaveAttribute("alt", "Nasi Goreng");
  });

  it("renders defaults when optional data is missing", () => {
    const mockMenu = {
      id: "2",
      name: "Air Putih",
      imageUrl: null,
      category: null,
      price: 5000,
      description: null,
      ingredients: [],
    };

    mockUseMenuDetail.mockReturnValue({
      menu: mockMenu,
      isLoading: false,
    });

    render(<MenuDetail menuId="2" />);

    expect(screen.getByText("Uncategorized")).toBeInTheDocument();
    expect(screen.getByText("Tidak ada deskripsi.")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/gambar/fast-food.png");
  });
});

describe("edit-form component", () => {
  const mockMenu = {
    id: "1",
    name: "Nasi Goreng",
    imageUrl: "/img.jpg",
    category: { id: 1, name: "Main Course" },
    categoryId: 1,
    price: 25000,
    description: "Enak sekali",
    ingredients: ["Nasi", "Telur", "Kecap"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      refresh: jest.fn(),
    });

    global.fetch = jest.fn((url: any, options?: any) => {
      const urlString = url.toString();
      if (urlString.includes("/api/categories")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ id: 1, name: "Main Course" }]),
        } as Response);
      }
      if (urlString.includes("/api/menus/1")) {
        if (options?.method === "PATCH" || options?.method === "DELETE") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMenu),
        } as Response);
      }
      return Promise.reject("Unknown URL");
    }) as jest.Mock;
  });

  it("renders edit form correctly", async () => {
    render(<EditForm menuId="1" onUpdate={() => {}} />);

    await waitFor(() =>
      expect(screen.queryByText("Memuat data form...")).not.toBeInTheDocument()
    );

    expect(screen.getByDisplayValue("Nasi Goreng")).toBeInTheDocument();
    expect(screen.getByText("Main Course")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Enak sekali")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Nasi, Telur, Kecap")).toBeInTheDocument();
  });

  it("should change the detail menu when edit is success", async () => {
    const oldMenuDetail = { ...mockMenu };
    const newMenuDetail = { ...mockMenu, name: "Makanan Baru" };

    let showNew = false;
    const mockUseMenuDetail = useMenuDetail as jest.Mock;
    mockUseMenuDetail.mockImplementation(() => {
      return {
        menu: showNew ? newMenuDetail : oldMenuDetail,
        isLoading: false,
      };
    });

    const TestWrapper = () => {
      const [refresh, setRefresh] = useState(0);
      return (
        <div>
          <MenuDetail key={refresh} menuId="1" />
          <EditForm
            menuId="1"
            onUpdate={() => {
              showNew = true;
              setRefresh((prev) => prev + 1);
            }}
          />
        </div>
      );
    };

    render(<TestWrapper />);

    // Expect Old Name (from MenuDetail)
    expect(screen.getByText("Nasi Goreng")).toBeInTheDocument();

    // Wait for Form Load
    await waitFor(() =>
      expect(screen.queryByText("Memuat data form...")).not.toBeInTheDocument()
    );

    // Edit Name in Form to "Makanan Baru"
    const nameInput = screen.getByTestId("edit-nama-menu");
    fireEvent.change(nameInput, { target: { value: "Makanan Baru" } });

    // Save
    fireEvent.click(screen.getByText("Simpan Perubahan"));
    fireEvent.click(screen.getByText("Ya, Simpan"));

    // Expect New Name in MenuDetail
    await waitFor(() => {
      expect(screen.getByText("Makanan Baru")).toBeInTheDocument();
    });
  });

  it("should delete the detail menu when is succeed", async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      refresh: jest.fn(),
    });

    render(<EditForm menuId="1" onUpdate={() => {}} />);

    // Wait for form to load
    await waitFor(() =>
      expect(screen.queryByText("Memuat data form...")).not.toBeInTheDocument()
    );

    // Click Delete button
    fireEvent.click(screen.getByText("Hapus Menu"));

    // Confirm Deletion
    const confirmBtn = await screen.findByText("Ya, Hapus");
    fireEvent.click(confirmBtn);

    // Expect router push
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/menu");
    });
  });
});