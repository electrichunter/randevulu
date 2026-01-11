'use server'

export async function logErrorToTerminal(error: any) {
    console.log("----------------------------------------");
    console.log("🔥 [VERİTABANI HATASI DETAYI] 🔥");
    console.log("Zaman:", new Date().toISOString());
    console.log("Mesaj:", error.message);
    console.log("Kod (Code):", error.code);
    console.log("İpucu (Hint):", error.hint);
    console.log("Detay (Details):", error.details);
    console.log("----------------------------------------");
}
