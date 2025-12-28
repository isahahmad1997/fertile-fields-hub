import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Users, Award, Globe } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Precision",
    description: "Every recommendation is data-driven and site-specific, ensuring optimal results for each unique field.",
  },
  {
    icon: Heart,
    title: "Sustainability",
    description: "We're committed to agricultural practices that protect the environment for future generations.",
  },
  {
    icon: Users,
    title: "Partnership",
    description: "We work alongside farmers as trusted partners, sharing knowledge and growing together.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in soil analysis, GIS mapping, and agronomic recommendations.",
  },
];

const milestones = [
  { year: "2019", event: "Founded with a vision to transform Nigerian agriculture through precision technology" },
  { year: "2020", event: "Completed first 500 hectares of precision soil mapping in Kaduna State" },
  { year: "2021", event: "Expanded services to 6 states across Nigeria's agricultural belt" },
  { year: "2022", event: "Launched variable-rate application partnerships with major fertilizer companies" },
  { year: "2023", event: "Reached milestone of 10,000+ hectares mapped with proven yield improvements" },
  { year: "2024", event: "Introduced advanced GIS analytics and subscription-based services" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transforming Nigerian Agriculture Through{" "}
              <span className="text-primary">Precision Science</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge soil science with advanced GIS technology to help farmers 
              optimize yields, reduce costs, and build sustainable agricultural practices.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-6">
                From Research to Real-World Impact
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  PrecisionSoil was born from a simple observation: Nigerian farmers were applying 
                  fertilizers uniformly across their fields, unaware that soil properties can vary 
                  dramatically within a single hectare.
                </p>
                <p>
                  Our founders, a team of soil scientists and GIS specialists, saw an opportunity 
                  to bridge the gap between advanced agricultural research and practical farming. 
                  They set out to make precision agriculture accessible and affordable for farmers 
                  of all scales.
                </p>
                <p>
                  Today, we've helped hundreds of farmers across Nigeria optimize their fertilizer 
                  use, improving yields by an average of 25% while reducing input costs by up to 30%. 
                  Our work continues to expand as we partner with fertilizer companies, agricultural 
                  dealers, and progressive farmers committed to sustainable intensification.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elegant">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Globe className="w-24 h-24 text-primary/40" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border">
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">Hectares Mapped</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission */}
            <div className="bg-card p-8 lg:p-10 rounded-2xl border border-border shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower Nigerian farmers with precision soil data and actionable insights 
                that maximize crop yields, minimize environmental impact, and build long-term 
                soil health. We strive to make advanced agricultural technology accessible to 
                farmers of all scales, transforming the way Nigeria grows food.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-card p-8 lg:p-10 rounded-2xl border border-border shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                A future where every Nigerian farmer has access to precision soil intelligence, 
                where fertilizer waste is eliminated, and where agricultural productivity grows 
                hand-in-hand with environmental stewardship. We envision becoming West Africa's 
                leading precision agriculture partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Drives Us Every Day
            </h2>
            <p className="text-muted-foreground">
              These core principles guide our work and define how we serve our partners.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Our Journey
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Key Milestones
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-start gap-6 mb-8 last:mb-0 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full md:-translate-x-1/2 mt-2 ring-4 ring-background" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2">
                      {milestone.year}
                    </span>
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-gradient-hero rounded-3xl p-12 lg:p-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of forward-thinking farmers who are already benefiting from 
              precision soil mapping and variable-rate fertilizer applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="hero" asChild>
                <Link to="/contact">Request a Consultation</Link>
              </Button>
              <Button size="lg" variant="hero-outline" asChild>
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
