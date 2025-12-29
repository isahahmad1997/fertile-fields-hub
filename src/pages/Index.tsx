import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  MapPin,
  FlaskConical,
  FileSpreadsheet,
  TrendingUp,
  Users,
  Leaf,
  BarChart3,
} from "lucide-react";
import heroImage from "@/assets/hero-farmland.jpg";
import soilSampleImage from "@/assets/soil-sample.jpg";
import gisMapImage from "@/assets/gis-map.jpg";

const stats = [
  { value: "50,000+", label: "Hectares Mapped" },
  { value: "200+", label: "Active Clients" },
  { value: "15%", label: "Average Yield Increase" },
  { value: "30%", label: "Fertilizer Savings" },
];

const features = [
  {
    icon: FlaskConical,
    title: "Precision Soil Testing",
    description:
      "Comprehensive lab analysis of soil samples to determine exact nutrient levels and pH balance across your fields.",
  },
  {
    icon: MapPin,
    title: "GIS Fertility Mapping",
    description:
      "Advanced spatial analysis creates detailed fertility maps showing nutrient distribution patterns across your farmland.",
  },
  {
    icon: FileSpreadsheet,
    title: "Variable-Rate Prescriptions",
    description:
      "Custom VRA maps that tell you exactly how much fertilizer to apply at each point of your field.",
  },
  {
    icon: TrendingUp,
    title: "Yield Optimization",
    description:
      "Data-driven recommendations to maximize your crop yields while minimizing input costs and environmental impact.",
  },
];

const testimonials = [
  {
    quote:
      "GeoSoilLab helped us reduce fertilizer costs by 35% while increasing our maize yield. The maps are incredibly accurate.",
    author: "Adekunle Okonkwo",
    role: "Farm Manager, Oyo State",
  },
  {
    quote:
      "Their GIS mapping service transformed how we manage our 500-hectare rice farm. Highly recommended for serious farmers.",
    author: "Chioma Adebayo",
    role: "Agricultural Director, Kebbi State",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Aerial view of Nigerian farmland"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6 animate-fade-in-up backdrop-blur-sm border border-primary-foreground/20">
              <Leaf className="w-4 h-4" />
              Precision Agriculture for Nigerian Farms
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-primary-foreground leading-tight mb-6 animate-fade-in-up animation-delay-100">
              Unlock Your Soil's Full Potential
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl animate-fade-in-up animation-delay-200">
              Advanced soil fertility mapping and variable-rate fertilizer prescriptions to help Nigerian farmers increase yields, reduce costs, and farm sustainably.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Request a Service
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Stats Card */}
        <div className="hidden lg:block absolute bottom-12 right-8 xl:right-16 z-10 animate-fade-in-up animation-delay-400">
          <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-strong p-6 border border-border">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (Mobile) */}
      <section className="lg:hidden py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-card rounded-xl p-4 shadow-soft">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mt-4 mb-6">
              Data-Driven Farming Solutions
            </h2>
            <p className="text-muted-foreground text-lg">
              We combine advanced soil science with GIS technology to help you understand exactly what your soil needs—no more guesswork.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-border hover:border-primary/20"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                How It Works
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mt-4 mb-6">
                From Soil Sample to Smart Prescription
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our streamlined process transforms raw soil data into actionable insights you can use immediately in the field.
              </p>

              <div className="space-y-6">
                {[
                  { step: "01", title: "Soil Sampling", desc: "We collect geo-referenced samples across your field" },
                  { step: "02", title: "Lab Analysis", desc: "Samples are tested for N, P, K, pH, and organic matter" },
                  { step: "03", title: "GIS Mapping", desc: "We create detailed fertility maps using spatial analysis" },
                  { step: "04", title: "VRA Prescription", desc: "You receive custom fertilizer application maps" },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="default" size="lg" className="mt-8" asChild>
                <Link to="/how-it-works">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-strong">
                <img
                  src={gisMapImage}
                  alt="GIS soil fertility map visualization"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-medium border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-leaf-green/20 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-leaf-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Precision Data</p>
                    <p className="text-sm text-muted-foreground">99.5% Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mt-4 mb-6">
              Trusted by Nigerian Farmers
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-harvest-gold"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-foreground text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={soilSampleImage}
            alt="Rich fertile soil"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/85" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6">
              Ready to Transform Your Farming Operation?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              Join hundreds of Nigerian farmers who are already using precision agriculture to increase yields and reduce costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Request a Service
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
