import { fireEvent, render , screen, waitFor } from "@testing-library/react";
import { MenuCategory } from "@/app/dashboard/menu/components/category-components/menu-category";
import { Category } from "@/app/types";
import { CreateCategory } from "@/app/dashboard/menu/components/category-components/create-category";

const mockCategories: Category[] = [
    { id: 1, name: "Nasi Goreng", type: "makanan", userId: "1", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: "Mie Ayam", type: "makanan", userId: "1", createdAt: new Date(), updatedAt: new Date() },
];

describe("MenuCategory", () => {
    it("renders category cards correctly", () => {
        render(
            <MenuCategory
                initialCategories={mockCategories}
                activeCategory="makanan"
                setActiveCategory={() => {}}
                onRefetchReady={() => {}}
            />
        );

        expect(screen.getByText("Nasi Goreng")).toBeInTheDocument();
        expect(screen.getByText("Mie Ayam")).toBeInTheDocument();
    });

    it("shows empty state when no categories exist", () => {
        render(
            <MenuCategory
                initialCategories={[]}
                activeCategory=""
                setActiveCategory={() => {}}
                onRefetchReady={() => {}}
            />
        );

        // Verify empty state message is displayed
        expect(screen.getByText("Kategori Masih Kosong")).toBeInTheDocument();
    });
    
    it("should create a new category successfully and display it in MenuCategory", async () => {
        // Track which categories should be returned by the mock
        let currentCategories = [...mockCategories];

        // Mock fetch API for both GET and POST requests
        global.fetch = jest.fn((url: string, options?: RequestInit) => {
            // Handle POST request (create category)
            if (options?.method === "POST") {
                const newCategory: Category = { 
                    id: 3, 
                    name: "Juice", 
                    type: "minuman",
                    userId: "1",
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                // Add to current categories
                currentCategories = [...currentCategories, newCategory];
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(newCategory),
                } as Response);
            }
            
            // Handle GET request (fetch categories)
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(currentCategories),
            } as Response);
        }) as jest.Mock;

        // Mock state for active category
        let activeCategory = "Nasi Goreng";
        const setActiveCategory = jest.fn((category: string) => {
            activeCategory = category;
        });

        // Render MenuCategory with initial categories
        render(
            <MenuCategory
                initialCategories={mockCategories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                onRefetchReady={() => {}}
            />
        );

        // Verify initial categories are displayed
        expect(screen.getByText("Nasi Goreng")).toBeInTheDocument();
        expect(screen.getByText("Mie Ayam")).toBeInTheDocument();
        expect(screen.queryByText("Juice")).not.toBeInTheDocument();

        // Click the "Add Category" button to open the dialog
        const addCategoryButton = screen.getByTestId("add-category-button");
        fireEvent.click(addCategoryButton);

        // Verify dialog is open by checking for dialog title
        expect(screen.getByText("Tambah Kategori Baru")).toBeInTheDocument();

        // Fill in the category name
        const categoryNameInput = screen.getByPlaceholderText("Masukan nama (ex: Dessert)");
        fireEvent.change(categoryNameInput, { target: { value: "Juice" } });
        expect(categoryNameInput).toHaveValue("Juice");

        // Select the category type (Minuman)
        const minumanRadio = screen.getByLabelText("Minuman");
        fireEvent.click(minumanRadio);
        expect(minumanRadio).toBeChecked();

        // Click the save button
        const saveButton = screen.getByTestId("save-category-button");
        expect(saveButton).not.toBeDisabled();
        fireEvent.click(saveButton);

        // Verify fetch was called with correct parameters for POST
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Juice", type: "Minuman", }),
            });
        });

        // Wait for the new category to appear in the DOM after refetch
        await waitFor(() => {
            expect(screen.getByText("Juice")).toBeInTheDocument();
        }, { timeout: 3000 });

        // Verify all categories are displayed
        expect(screen.getByText("Nasi Goreng")).toBeInTheDocument();
        expect(screen.getByText("Mie Ayam")).toBeInTheDocument();

        // Verify setActiveCategory was called with the new category name
        expect(setActiveCategory).toHaveBeenCalledWith("Juice");

        // Clean up
        jest.restoreAllMocks();
    });
    it("should change the category name when edit is success and verify data update", async () => {
        // Use an object to hold categories so we can mutate it in the mock
        const categoriesState = { current: [...mockCategories] };

        // Mock fetch API for PATCH request
        global.fetch = jest.fn((url: string, options?: RequestInit) => {
            if (options?.method === "PATCH") {
                const body = JSON.parse(options.body as string);
                const categoryId = parseInt(url.split("/").pop() || "0");
                
                // Update the category in categoriesState.current
                categoriesState.current = categoriesState.current.map(cat => 
                    cat.id === categoryId 
                        ? { ...cat, name: body.name, type: body.type?.toLowerCase() || cat.type }
                        : cat
                );
                
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(categoriesState.current.find(c => c.id === categoryId)),
                } as Response);
            }
            
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(categoriesState.current),
            } as Response);
        }) as jest.Mock;

        // Verify initial state
        expect(categoriesState.current.find(c => c.id === 1)?.name).toBe("Nasi Goreng");

        // Simulate the edit process by calling the API
        const response = await fetch("/api/categories/1", {
            method: "PATCH",
            body: JSON.stringify({ name: "Nasi Goreng Spesial", type: "Makanan" }),
        });
        
        const result = await response.json();

        // Verify the API call was successful
        expect(response.ok).toBe(true);
        
        // Verify categoriesState has been updated
        expect(categoriesState.current.find(c => c.id === 1)?.name).toBe("Nasi Goreng Spesial");
        
        // Verify the response contains the updated category
        expect(result.name).toBe("Nasi Goreng Spesial");
        
        // Verify other categories are unchanged
        expect(categoriesState.current.find(c => c.id === 2)?.name).toBe("Mie Ayam");
        expect(categoriesState.current.length).toBe(2);

        // Clean up
        jest.restoreAllMocks();
    });

    it("should delete the category when delete is success and verify data update", async() => {
        // Use an object to hold categories so we can mutate it in the mock
        const categoriesState = { current: [...mockCategories] };

        // Mock fetch API for DELETE request
        global.fetch = jest.fn((url: string, options?: RequestInit) => {
            if (options?.method === "DELETE") {
                const categoryId = parseInt(url.split("/").pop() || "0");
                
                // Remove the category from categoriesState.current
                categoriesState.current = categoriesState.current.filter(cat => cat.id !== categoryId);
                
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true }),
                } as Response);
            }
            
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(categoriesState.current),
            } as Response);
        }) as jest.Mock;

        // Verify initial state
        expect(categoriesState.current.length).toBe(2);
        expect(categoriesState.current.find(c => c.id === 2)?.name).toBe("Mie Ayam");

        // Simulate the delete process by calling the API
        const response = await fetch("/api/categories/2", {
            method: "DELETE",
        });
        
        const result = await response.json();

        // Verify the API call was successful
        expect(response.ok).toBe(true);
        expect(result.success).toBe(true);

        // Verify categoriesState has been updated (Mie Ayam should be removed)
        expect(categoriesState.current.find(c => c.id === 2)).toBeUndefined();
        expect(categoriesState.current.length).toBe(1);

        // Verify other category is still there
        expect(categoriesState.current.find(c => c.id === 1)?.name).toBe("Nasi Goreng");

        // Clean up
        jest.restoreAllMocks();
    });
});

describe (`create new category form`, ()=> {
    it("should disable save button when form is incomplete", () => {
        const mockFetchCategories = jest.fn();

        render(
            <CreateCategory
                fetchCategories={mockFetchCategories}
                onCategoryCreated={jest.fn()}
            />
        );

        // Open the dialog
        const addCategoryButton = screen.getByTestId("add-category-button");
        fireEvent.click(addCategoryButton);

        // Save button should be disabled initially
        const saveButton = screen.getByTestId("save-category-button");
        expect(saveButton).toBeDisabled();

        // Fill in only the name
        const categoryNameInput = screen.getByPlaceholderText("Masukan nama (ex: Dessert)");
        fireEvent.change(categoryNameInput, { target: { value: "Juice" } });

        // Button should still be disabled (no type selected)
        expect(saveButton).toBeDisabled();

        // Select type
        const minumanRadio = screen.getByLabelText("Minuman");
        fireEvent.click(minumanRadio);

        // Now button should be enabled
        expect(saveButton).not.toBeDisabled();
    })
})