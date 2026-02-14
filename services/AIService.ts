import { GoogleGenAI, Type } from "@google/genai";
import { Product, CartItem, UserActivity } from "../types.js";

class AIService {
  private getAI() {
    const key = import.meta.env.VITE_GOOGLE_AI_KEY || import.meta.env.VITE_API_KEY || "dummy_key";
    return new GoogleGenAI({ apiKey: key });
  }

  async chatWithChef(message: string) {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `You are Chef Pierre, a world-class French pastry chef AI assistant for a luxury baking supply shop called Sweet Luxe. 
        Your tone is sophisticated, slightly French (use occasional French words like 'voila', 'magnifique'), and helpful.
        User asks: "${message}"
        Provide a helpful, expert response in 2-3 sentences.`,
      });
      return response.text;
    } catch (error) {
      console.error("AI Chat Error:", error);
      return "Ah, mon ami, the kitchen is chaotic right now. Please ask me again in a moment.";
    }
  }

  async getSmartSearchSuggestions(query: string, products: Product[]) {
    try {
      const ai = this.getAI();
      const productNames = products.map(p => p.name).join(", ");
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Given the query "${query}" and our catalog [${productNames}], suggest 3-5 relevant search completions or related baking/confectionery terms. Return a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text || "[]") as string[];
    } catch (error) {
      console.error("AI Search Error:", error);
      return [];
    }
  }

  async getChefInsights(product: Product) {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Act as a world-class pastry chef. Provide a 2-sentence expert tip for using "${product.name}" (${product.description}). Focus on professional techniques or flavor pairings in a high-end confectionery context.`,
      });
      return response.text;
    } catch (error) {
      console.error("AI Insight Error:", error);
      return "Ensure your workspace is at the correct temperature for the best results with this professional grade item.";
    }
  }

  async getPersonalizedRecommendations(activities: UserActivity[], products: Product[]) {
    try {
      const ai = this.getAI();
      const recentViews = activities.filter(a => a.type === 'view').slice(0, 5).map(a => a.productId);
      const catalog = products.map(p => ({ id: p.id, name: p.name, category: p.category }));
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `User recently viewed product IDs: [${recentViews.join(", ")}]. Based on this behavior and our catalog [${JSON.stringify(catalog)}], recommend 3 products. Return only a JSON array of product IDs.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text || "[]") as string[];
    } catch (error) {
      return [];
    }
  }

  async getCartUpsell(cart: CartItem[], products: Product[]) {
    try {
      const ai = this.getAI();
      const cartItems = cart.map(i => i.name).join(", ");
      const available = products.filter(p => !cart.some(ci => ci.id === p.id)).map(p => ({ id: p.id, name: p.name }));
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Customer has [${cartItems}] in their cart. Suggest ONE complementary item from [${JSON.stringify(available)}] that would enhance their baking project. Return JSON object { "productId": "id", "reason": "short explanation" }.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productId: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["productId", "reason"]
          }
        }
      });
      return JSON.parse(response.text || "{}") as { productId: string; reason: string };
    } catch (error) {
      return null;
    }
  }
}

export default new AIService();