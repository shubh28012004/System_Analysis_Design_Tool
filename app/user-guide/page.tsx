"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search } from "lucide-react"

const guides = [
  {
    title: "How to Define Geometry",
    steps: [
      "Navigate to the Geometry Editor",
      "Choose a shape type (cube, cylinder, etc.)",
      "Adjust the size and other parameters",
      "Click 'Save Geometry' to confirm your changes",
    ],
  },
  {
    title: "How to Run FEM Analysis",
    steps: [
      "Access the FEM Results page",
      "Set your analysis parameters (force, constraints)",
      "Click 'Run FEM Analysis' to begin",
      "Monitor the progress bar for completion",
      "View the results in the chart after analysis is complete",
    ],
  },
  {
    title: "Understanding FEM Results",
    steps: [
      "Examine the force-displacement graph",
      "Analyze the 3D model visualization",
      "Interpret the displacement values",
      "Consider the applied forces and constraints",
    ],
  },
]

const faqs = [
  {
    question: "What is FEM analysis?",
    answer:
      "FEM (Finite Element Method) analysis is a numerical method for solving problems of engineering and mathematical physics. It's used to find approximate solutions to boundary value problems for partial differential equations.",
  },
  {
    question: "How accurate are the simulation results?",
    answer:
      "The accuracy of simulation results depends on various factors including mesh quality, material properties, and boundary conditions. While our tool strives for high accuracy, it's always recommended to validate results with experimental data when possible.",
  },
  {
    question: "Can I import my own 3D models?",
    answer:
      "Currently, the tool supports basic shape creation within the application. We're working on adding import functionality for custom 3D models in future updates.",
  },
  {
    question: "Is mesh generation performed automatically?",
    answer:
      "Yes, mesh generation is performed internally as part of the FEM analysis process. You don't need to manually generate or adjust the mesh.",
  },
]

export default function UserGuidePage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredGuides = guides.filter((guide) => guide.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredFaqs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="container mx-auto py-8 space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8"
      >
        User Guide
      </motion.h1>

      <div className="relative">
        <Input
          type="text"
          placeholder="Search guides and FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        {filteredGuides.map((guide, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{guide.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {guide.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common queries about our structural analysis tool.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

