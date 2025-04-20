"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import PlaceholderImage from "./placeholder-images";
import "./styles.css";

export default function AIcademy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <PageHeader 
        title="AIcademy" 
        description="Empowering individuals and organizations through AI education and innovation" 
        className="text-center py-16 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]"
      />
      
      <Section className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
                Bridge the AI Knowledge Gap
              </h2>
              <p className="text-xl text-slate-300">
                We have a massive lack of people who truly understand AI, and it's our mission to fill that gap. 
                Ensure your organization remains resilient for the future by investing in AI education today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black hover:opacity-90">
                  Explore Workshops
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  View Online Courses
                </Button>
              </div>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
              <PlaceholderImage type="workshop" className="w-full h-full" />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-slate-900/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How AIcademy Transforms Your Organization</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Supporting the drive to learn and chase innovation ensures your company's future resilience
              while validating your team's skills and contributions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Strategic Consulting",
                description: "Customized AI strategy development for your specific business needs and challenges.",
                type: "consulting"
              },
              {
                title: "Hands-on Workshops",
                description: "Interactive sessions where your team builds real AI solutions relevant to your industry.",
                type: "hands-on"
              },
              {
                title: "Executive Training",
                description: "Specialized programs for leadership to drive AI initiatives from the top down.",
                type: "executive"
              }
            ].map((item, i) => (
              <Card key={i} className="bg-slate-800/50 border-[#3CDFFF]/20 overflow-hidden hover-card-effect">
                <div className="relative h-48">
                  <PlaceholderImage type={item.type} className="w-full h-full" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                  <PlaceholderImage type="testimonial" number={num} className="w-full h-full" />
                </div>
              ))}
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Real People, Real Transformation</h2>
              <p className="text-xl text-slate-300">
                Our programs have helped professionals across industries not just understand AI, 
                but apply it meaningfully to create value and feel fulfilled in their day-to-day work.
              </p>
              <div className="space-y-4">
                {[
                  {
                    quote: "The AIcademy workshop completely changed how our team approaches problem-solving. We're now confidently leveraging AI in our daily operations.",
                    author: "Sarah Johnson, CTO"
                  },
                  {
                    quote: "As someone with no technical background, I was worried AI would leave me behind. AIcademy made complex concepts accessible and practical.",
                    author: "Mark Zhang, Marketing Director"
                  }
                ].map((testimonial, i) => (
                  <blockquote key={i} className="border-l-4 border-[#4AFFD4] pl-4 italic quote-mark relative">
                    <p className="mb-2">{testimonial.quote}</p>
                    <footer className="text-slate-400">— {testimonial.author}</footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
      
      <Section className="py-16 bg-slate-900/50">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-12">Our Educational Offerings</h2>
          
          <Tabs defaultValue="workshops" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="workshops">Workshops</TabsTrigger>
              <TabsTrigger value="courses">Online Courses</TabsTrigger>
              <TabsTrigger value="consulting">Strategic Consulting</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            
            {["workshops", "courses", "consulting", "events"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-8 animate-fade-in">
                {tab === "consulting" ? (
                  <>
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-4">Explaining Discussion</h3>
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                        <video 
                          className="w-full h-full object-cover" 
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source src="/videos/aicademy/explaining-discussion.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <p className="mt-4 text-slate-300">
                        Watch our strategic consulting experts explain how to facilitate meaningful discussions 
                        that drive AI transformation within your organization.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[1, 2].map((item) => (
                        <Card key={item} className="bg-slate-800/50 border-[#3CDFFF]/20 hover-card-effect">
                          <div className="relative h-48">
                            <PlaceholderImage 
                              type={tab} 
                              number={item}
                              className="w-full h-full"
                            />
                          </div>
                          <CardHeader>
                            <CardTitle>AI Strategy Development {item}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-slate-300 text-base">
                              Empowering your team with the knowledge and skills to leverage AI effectively
                              in your specific business context.
                            </CardDescription>
                            <Button className="mt-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black hover:opacity-90">Learn More</Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((item) => (
                      <Card key={item} className="bg-slate-800/50 border-[#3CDFFF]/20 hover-card-effect">
                        <div className="relative h-48">
                          <PlaceholderImage 
                            type={tab} 
                            number={item}
                            className="w-full h-full"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle>{tab === "workshops" ? "Hands-on AI Implementation" : 
                                     tab === "courses" ? "AI Fundamentals Course" :
                                     tab === "consulting" ? "AI Strategy Development" : 
                                     "AI Innovation Summit"} {item}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-slate-300 text-base">
                            Empowering your team with the knowledge and skills to leverage AI effectively
                            in your specific business context.
                          </CardDescription>
                          <Button className="mt-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black hover:opacity-90">Learn More</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </Container>
      </Section>
      
      <Section className="py-16 grid-pattern">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Future-Proof Your Organization?</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Invest in your team's AI literacy today and ensure your company remains competitive and innovative.
            </p>
          </div>
          
          <div className="max-w-xl mx-auto bg-slate-800/40 rounded-xl p-8 shadow-2xl relative neon-glow">
            <h3 className="text-2xl font-bold mb-6">Request Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded bg-slate-700/70 border border-[#3CDFFF]/30 focus:border-[#4AFFD4] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded bg-slate-700/70 border border-[#3CDFFF]/30 focus:border-[#4AFFD4] transition-colors" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="w-full px-4 py-2 rounded bg-slate-700/70 border border-[#3CDFFF]/30 focus:border-[#4AFFD4] transition-colors" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <input type="text" className="w-full px-4 py-2 rounded bg-slate-700/70 border border-[#3CDFFF]/30 focus:border-[#4AFFD4] transition-colors" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">I'm interested in:</label>
                <select className="w-full px-4 py-2 rounded bg-slate-700/70 border border-[#3CDFFF]/30 focus:border-[#4AFFD4] transition-colors">
                  <option>Workshops</option>
                  <option>Online Courses</option>
                  <option>Strategic Consulting</option>
                  <option>Events</option>
                </select>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black font-medium hover:opacity-90 mt-4">
                Request Information
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
} 