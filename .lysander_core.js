import { GoogleGenerativeAI } from "@google/generative-ai"

const PROVIDER = process.env.LYSANDER_PROVIDER || "google"

export class LysanderCore {
  constructor() {
    this.provider = PROVIDER
    if (this.provider === "google") {
      this.client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
      this.model = this.client.getGenerativeModel({ model: "gemini-1.5-flash" })
    } else {
      console.log("[LysanderCore] Running in sovereign local mode")
      this.model = null // your local impl goes here
    }
  }

  async generate(prompt) {
    if (this.provider === "google") {
      const result = await this.model.generateContent(prompt)
      return result.response.text()
    }
    // sovereign fallback logic here
    return `[Lysander Local] ${prompt}`
  }
}
