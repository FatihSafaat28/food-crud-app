import { supabase } from "./supabase-client";

/**
 * Upload a menu image to Supabase Storage
 * @param file - The image file to upload
 * @returns The public URL of the uploaded image
 */
export async function uploadMenuImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from("menu-images")
    .upload(filePath, file);

  if (error) {
    console.error("Upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("menu-images").getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete a menu image from Supabase Storage
 * @param imageUrl - The full URL of the image to delete
 * @returns True if deletion was successful
 */
export async function deleteMenuImage(imageUrl: string): Promise<boolean> {
  try {
    const fileName = imageUrl.split("/").pop();

    if (!fileName) {
      console.error("Invalid image URL");
      return false;
    }

    const { data, error } = await supabase.storage
      .from("menu-images")
      .remove([fileName]);

    if (error) {
      console.error("Delete error:", error.message);
      return false;
    }

    console.log("Image deleted successfully:", data);
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

/**
 * Extract filename from Supabase storage URL
 * @param url - The full storage URL
 * @returns The filename or null if invalid
 */
export function getFileNameFromUrl(url: string): string | null {
  return url.split("/").pop() || null;
}
