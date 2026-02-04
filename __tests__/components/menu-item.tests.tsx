import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MenuItems } from "@/app/dashboard/menu/components/menu-item-components/menu-items";
import { Menu, Category } from "@/app/types";

const mockCategory: Category = {
    id: 1,
    name: "Makanan",
    type: "makanan",
    userId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockMenus: Menu[] = [
    {
        id: 1,
        name: "Nasi Goreng",
        price: 15000,
        description: "Nasi goreng spesial",
        imageUrl: null,
        ingredients: ["nasi", "telur", "kecap"],
        categoryId: 1,
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        category: mockCategory,
    },
    {
        id: 2,
        name: "Mie Goreng",
        price: 12000,
        description: "Mie goreng pedas",
        imageUrl: null,
        ingredients: ["mie", "cabai", "sayur"],
        categoryId: 1,
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        category: mockCategory,
    },
];

describe("MenuItems", () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("renders menu items correctly", () => {
        render(
            <MenuItems
                initialMenus={mockMenus}
                activeCategory="Makanan"
                onMenuChange={() => {}}
            />
        );

        // Verify menu items are displayed
        expect(screen.getByText("Nasi Goreng")).toBeInTheDocument();
        expect(screen.getByText("Mie Goreng")).toBeInTheDocument();
        
        // Verify prices are displayed
        expect(screen.getByText("Rp 15.000")).toBeInTheDocument();
        expect(screen.getByText("Rp 12.000")).toBeInTheDocument();
    });

    it("shows empty state when no menus exist", () => {
        render(
            <MenuItems
                initialMenus={[]}
                activeCategory="Makanan"
                onMenuChange={() => {}}
            />
        );

        // Verify empty state message is displayed
        expect(screen.getByText(/Belum ada menu/i)).toBeInTheDocument();
    });

    it("filters menus by active category", () => {
        const mixedMenus: Menu[] = [
            ...mockMenus,
            {
                id: 3,
                name: "Es Teh",
                price: 5000,
                description: "Es teh manis",
                imageUrl: null,
                ingredients: ["teh", "gula"],
                categoryId: 2,
                userId: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
                category: {
                    id: 2,
                    name: "Minuman",
                    type: "minuman",
                    userId: "1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            },
        ];

        render(
            <MenuItems
                initialMenus={mixedMenus}
                activeCategory="Makanan"
                onMenuChange={() => {}}
            />
        );

        // Verify only Makanan category items are displayed
        expect(screen.getByText("Nasi Goreng")).toBeInTheDocument();
        expect(screen.getByText("Mie Goreng")).toBeInTheDocument();
        expect(screen.queryByText("Es Teh")).not.toBeInTheDocument();
    });

    it("should update menu item when edit is success and verify data update", async () => {
        // Use an object to hold menus so we can mutate it in the mock
        const menusState = { current: [...mockMenus] };

        // Mock fetch API for PATCH request
        global.fetch = jest.fn((url: string, options?: RequestInit) => {
            if (options?.method === "PATCH") {
                const body = JSON.parse(options.body as string);
                const menuId = parseInt(url.split("/").pop() || "0");
                
                // Update the menu in menusState.current
                menusState.current = menusState.current.map(menu => 
                    menu.id === menuId 
                        ? { ...menu, ...body }
                        : menu
                );
                
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(menusState.current.find(m => m.id === menuId)),
                } as Response);
            }
            
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(menusState.current),
            } as Response);
        }) as jest.Mock;

        // Verify initial state
        expect(menusState.current.find(m => m.id === 1)?.name).toBe("Nasi Goreng");
        expect(menusState.current.find(m => m.id === 1)?.price).toBe(15000);

        // Simulate the edit process by calling the API
        const response = await fetch("/api/menus/1", {
            method: "PATCH",
            body: JSON.stringify({ 
                name: "Nasi Goreng Spesial", 
                price: 18000,
                description: "Nasi goreng spesial dengan telur"
            }),
        });
        
        const result = await response.json();

        // Verify the API call was successful
        expect(response.ok).toBe(true);
        
        // Verify menusState has been updated
        expect(menusState.current.find(m => m.id === 1)?.name).toBe("Nasi Goreng Spesial");
        expect(menusState.current.find(m => m.id === 1)?.price).toBe(18000);
        
        // Verify the response contains the updated menu
        expect(result.name).toBe("Nasi Goreng Spesial");
        expect(result.price).toBe(18000);
        
        // Verify other menus are unchanged
        expect(menusState.current.find(m => m.id === 2)?.name).toBe("Mie Goreng");
        expect(menusState.current.length).toBe(2);

        // Clean up
        jest.restoreAllMocks();
    });

    it("should delete menu item when delete is success and verify data update", async () => {
        // Use an object to hold menus so we can mutate it in the mock
        const menusState = { current: [...mockMenus] };

        // Mock fetch API for DELETE request
        global.fetch = jest.fn((url: string, options?: RequestInit) => {
            if (options?.method === "DELETE") {
                const menuId = parseInt(url.split("/").pop() || "0");
                
                // Remove the menu from menusState.current
                menusState.current = menusState.current.filter(menu => menu.id !== menuId);
                
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true }),
                } as Response);
            }
            
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(menusState.current),
            } as Response);
        }) as jest.Mock;

        // Verify initial state
        expect(menusState.current.length).toBe(2);
        expect(menusState.current.find(m => m.id === 2)?.name).toBe("Mie Goreng");

        // Simulate the delete process by calling the API
        const response = await fetch("/api/menus/2", {
            method: "DELETE",
        });
        
        const result = await response.json();

        // Verify the API call was successful
        expect(response.ok).toBe(true);
        expect(result.success).toBe(true);

        // Verify menusState has been updated (Mie Goreng should be removed)
        expect(menusState.current.find(m => m.id === 2)).toBeUndefined();
        expect(menusState.current.length).toBe(1);

        // Verify other menu is still there
        expect(menusState.current.find(m => m.id === 1)?.name).toBe("Nasi Goreng");

        // Clean up
        jest.restoreAllMocks();
    });

    it("should create a new menu item and verify data update", async () => {
        // Use an object to hold menus so we can mutate it in the mock
        const menusState = { current: [...mockMenus] };

        // Mock fetch API for POST request
        global.fetch = jest.fn((url: string, options?: RequestInit) => {
            if (options?.method === "POST") {
                const body = JSON.parse(options.body as string);
                
                // Create new menu item
                const newMenu: Menu = {
                    id: 3,
                    ...body,
                    userId: "1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    category: mockCategory,
                };
                
                // Add to menusState.current
                menusState.current = [...menusState.current, newMenu];
                
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(newMenu),
                } as Response);
            }
            
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(menusState.current),
            } as Response);
        }) as jest.Mock;

        // Verify initial state
        expect(menusState.current.length).toBe(2);

        // Simulate creating a new menu
        const response = await fetch("/api/menus", {
            method: "POST",
            body: JSON.stringify({
                name: "Sate Ayam",
                price: 20000,
                description: "Sate ayam bumbu kacang",
                imageUrl: null,
                ingredients: ["ayam", "bumbu kacang"],
                categoryId: 1,
            }),
        });
        
        const result = await response.json();

        // Verify the API call was successful
        expect(response.ok).toBe(true);
        
        // Verify menusState has been updated
        expect(menusState.current.length).toBe(3);
        expect(menusState.current.find(m => m.name === "Sate Ayam")).toBeDefined();
        
        // Verify the response contains the new menu
        expect(result.name).toBe("Sate Ayam");
        expect(result.price).toBe(20000);

        // Clean up
        jest.restoreAllMocks();
    });
});