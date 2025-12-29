import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Users, Award, Globe, Rocket } from "lucide-react";

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
  { year: "Dec 2025", event: "GeoSoilLab founded in Kano, Nigeria with a mission to transform precision agriculture" },
  { year: "Q1 2026", event: "Launch commercial services and complete first client projects in Northern Nigeria" },
  { year: "Q2 2026", event: "Expand services across Nigeria's agricultural belt" },
  { year: "2027", event: "Scale operations and introduce advanced GIS analytics and subscription-based services" },
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
              Pioneering Precision Agriculture in{" "}
              <span className="text-primary">Northern Nigeria</span>
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
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Rocket className="w-4 h-4" />
                Our Story
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-6">
                A Fresh Start in Precision Agriculture
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  GeoSoilLab was founded in December 2025 in Kano, Nigeria, born from a simple but powerful 
                  observation: Nigerian farmers are applying fertilizers uniformly across their fields, 
                  unaware that soil properties can vary dramatically within a single hectare.
                </p>
                <p>
                  Our founding team of soil scientists and GIS specialists saw an opportunity to bridge 
                  the gap between advanced agricultural research and practical farming. We set out to make 
                  precision agriculture accessible and affordable for farmers of all scales across Nigeria.
                </p>
                <p>
                  As a startup, we bring fresh perspectives, cutting-edge technology, and an unwavering 
                  commitment to helping farmers optimize their fertilizer use, improve yields, and reduce 
                  input costs. Our work is just beginning, but our vision is clear: to become Nigeria's 
                  trusted partner in precision soil intelligence.
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
                <div className="text-3xl font-bold text-primary">Dec 2025</div>
                <div className="text-sm text-muted-foreground">Founded in Kano</div>
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
                hand-in-hand with environmental stewardship. We envision becoming Nigeria's 
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
              Our Roadmap
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Key Milestones
            </h2>
            <p className="text-muted-foreground">
              Our journey from startup to Nigeria's precision agriculture leader.
            </p>
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
              Be Among Our First Clients
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join us at the start of something transformative. Be among the first farmers to 
              benefit from precision soil mapping and variable-rate fertilizer applications.
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