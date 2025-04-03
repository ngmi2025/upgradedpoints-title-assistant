"use client"

import { useState, useEffect } from "react"
import { Loader2, Download, Search, Clipboard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

// Add this type definition at the top of the file
type ResultItem = {
  title: string
  score: number | null
  style?: string
  tone?: string
}

export default function TitleOptimizer() {
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [characterLimit, setCharacterLimit] = useState("63")
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<Array<ResultItem>>([])
  const [selectedTitle, setSelectedTitle] = useState("")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImage, setGeneratedImage] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Initialize with 10 empty results
  useEffect(() => {
    if (results.length === 0) {
      const emptyResults = Array(10).fill({ title: "", score: null })
      setResults(emptyResults)
    }
  }, [results.length])

  const handleGenerateTitles = async () => {
    if (!title.trim()) {
      toast({
        title: "Please enter a title",
        description: "You need to enter a title to generate optimized versions",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const res = await fetch("/api/generate-titles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          charLimit: characterLimit,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      const formattedResults = data.titles.map((item: { title: string; score: number }) => ({
        title: item.title,
        score: item.score,
      }))

      setResults(formattedResults)
      setShowResults(true)

      toast({
        title: "Titles generated successfully",
        description: "10 optimized titles have been generated",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Generation failed",
        description: (err as Error).message || "There was an error generating titles",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClearResults = () => {
    const emptyResults = Array(10).fill({ title: "", score: null })
    setResults(emptyResults)
    setGeneratedImage("")
    setSelectedTitle("")
    setShowResults(false)
  }

  const handleGenerateImage = async (title: string, style?: string, tone?: string) => {
    if (!title || title.includes("Error:")) return

    setSelectedTitle(title)
    setIsGeneratingImage(true)

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, style, tone }),
      })

      const data = await res.json()

      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || "Image generation failed")
      }

      setGeneratedImage(data.imageUrl)

      toast({
        title: "Image generated",
        description: "Image has been generated for the selected title",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Image generation failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleCopyTitle = (title: string, index: number) => {
    if (!title || title.includes("Error:")) return

    navigator.clipboard
      .writeText(title)
      .then(() => {
        setCopiedIndex(index)

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopiedIndex(null)
        }, 2000)

        toast({
          title: "Title copied!",
          description: "The title has been copied to your clipboard",
        })
      })
      .catch((err) => {
        toast({
          title: "Failed to copy",
          description: "There was an error copying the title",
          variant: "destructive",
        })
      })
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-gray-500 font-medium"
    if (score >= 9) return "bg-up-score-high/20 text-up-score-high font-medium"
    if (score >= 7) return "bg-up-score-medium/20 text-up-score-medium font-medium"
    return "bg-up-score-low/20 text-up-score-low font-medium"
  }

export default function Page() {
  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-gray-500 font-medium"
    if (score >= 9) return "bg-up-score-high/20 text-up-score-high font-medium"
    if (score >= 7) return "bg-up-score-medium/20 text-up-score-medium font-medium"
    return "bg-up-score-low/20 text-up-score-low font-medium"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto py-5">
          <h1 className="text-3xl font-bold text-up-blue">UpgradedPoints Title Assistant</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="grid gap-6">
          {/* Search-style Input Section */}
          <section className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium uppercase tracking-wide text-up-charcoal">
              Enter Your Title
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="title"
                type="text"
                placeholder="Enter a title idea (e.g. Best credit cards for Disney 2025)"
                className="pl-10 pr-20 py-3 h-12 border-gray-300 focus:border-up-blue focus:ring-up-blue shadow-sm rounded-full"
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-xs text-gray-400">{title.length}/200</span>
              </div>
            </div>
          </section>

          {/* Character Limit Selector */}
          <section>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium uppercase tracking-wide text-up-charcoal mr-2">
                Character Limit:
              </Label>
              <RadioGroup value={characterLimit} onValueChange={setCharacterLimit} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="63" id="r1" className="text-up-blue" />
                  <Label htmlFor="r1" className="text-sm">
                    63 Characters
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="100" id="r2" className="text-up-blue" />
                  <Label htmlFor="r2" className="text-sm">
                    100 Characters
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </section>

          {/* Actions Section */}
          <section className="flex flex-wrap gap-3">
            <Button
              onClick={handleGenerateTitles}
              disabled={isGenerating}
              className="bg-up-blue hover:bg-up-blue/90 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Titles'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClearResults}
              className="border-up-charcoal/30 text-up-charcoal hover:bg-gray-100"
            >
              Clear Results
            </Button>
          </section>

          {/* Results Table Section */}
          {showResults && (
            <section className="space-y-3 mt-2 animate-in fade-in duration-500">
              <h2 className="text-sm font-medium uppercase tracking-wide text-up-charcoal">
                Optimized Titles & Scores
              </h2>
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[60%] font-medium">Title</TableHead>
                      <TableHead className="font-medium w-[10%]">Length</TableHead>
                      <TableHead className="font-medium w-[10%]">Score</TableHead>
                      <TableHead className="text-right font-medium w-[20%]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index} className={`border-b hover:bg-gray-50 transition-colors`}>
                        <TableCell className="font-medium py-3">
                          <div className="flex items-center justify-between">
                            <div className="pr-2">{result.title || "—"}</div>
                            {result.title && !result.title.includes("Error:") && (
                              <button
                                onClick={() => handleCopyTitle(result.title, index)}
                                className="p-1 rounded-md text-gray-400 hover:text-up-blue hover:bg-gray-100 transition-colors"
                                title="Copy Title"
                              >
                                {copiedIndex === index ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Clipboard className="h-4 w-4" />
                                )}
                                <span className="sr-only">Copy Title</span>
                              </button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{result.title ? result.title.length : "—"}</TableCell>
                        <TableCell>
                          {result.score !== null ? (
                            <span className={`px-2 py-1 rounded-full text-xs ${getScoreColor(result.score)}`}>
                              {result.score.toFixed(1)}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500">—</span>
                          )}
                        <TableCell className="text-right">
  <div className="flex flex-col gap-2">
    {/* Hidden Style dropdown */}
    <div className="flex items-center gap-2 justify-end hidden">
      <Label className="text-xs">Style</Label>
      <select
        value={result.style || "photorealistic"}
        onChange={(e) => {
          const updated = [...results]
          updated[index] = { ...result, style: e.target.value }
          setResults(updated)
        }}
        className="text-xs border rounded px-2 py-1"
      >
        <option value="photorealistic">Photorealistic</option>
        <option value="illustration">Illustration</option>
        <option value="typography">Bold Typography</option>
        <option value="minimalist">Minimalist</option>
      </select>
    </div>

    {/* Hidden Tone dropdown */}
    <div className="flex items-center gap-2 justify-end hidden">
      <Label className="text-xs">Tone</Label>
      <select
        value={result.tone || "curiosity"}
        onChange={(e) => {
          const updated = [...results]
          updated[index] = { ...result, tone: e.target.value }
          setResults(updated)
        }}
        className="text-xs border rounded px-2 py-1"
      >
        <option value="curiosity">Curiosity</option>
        <option value="luxury">Luxury</option>
        <option value="urgency">Urgency</option>
        <option value="surprise">Surprise</option>
        <option value="calm">Calm</option>
      </select>
    </div>

    {/* Coming Soon button */}
    <Button
      size="sm"
      disabled
      className="rounded-full bg-gray-200 text-gray-500 text-xs px-3 py-1 h-auto cursor-not-allowed"
    >
      Coming soon
    </Button>
  </div>
</TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          )}

          {/* Image Generator Section */}
          {showResults && selectedTitle && (
            <section className="space-y-3 bg-gray-50 rounded-lg p-6 shadow-md mt-6 animate-in fade-in duration-500">
              <h2 className="text-sm font-medium uppercase tracking-wide text-up-charcoal">Generated Image</h2>
              <p className="font-bold text-up-charcoal/80 text-lg mb-4">{selectedTitle}</p>

              {isGeneratingImage ? (
                <div className="flex justify-center items-center h-[400px] bg-white rounded-lg border">
                  <Loader2 className="h-8 w-8 animate-spin text-up-blue" />
                </div>
              ) : generatedImage ? (
                <div className="space-y-3">
                  <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt={`Generated image for ${selectedTitle}`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-up-blue text-up-blue hover:bg-up-blue/10"
                  >
                    <Download className="h-4 w-4" />
                    Download Image
                  </Button>
                </div>
              ) : null}
            </section>
          )}
        </div>
      </main>

      <footer className="border-t mt-8 bg-gray-50">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-sm text-gray-500">Powered by UpgradedPoints</p>
            <a href="#" className="text-sm text-up-blue hover:underline">
              Need help? Contact support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
} 
