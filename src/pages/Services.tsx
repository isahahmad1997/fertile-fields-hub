import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  FlaskConical,
  MapPin,
  FileSpreadsheet,
  TrendingUp,
  Microscope,
  Layers,
  Target,
  Sprout,
} from "lucide-react";
import soilSampleImage from "@/assets/soil-sample.jpg";
import gisMapImage from "@/assets/gis-map.jpg";

const mainServices = [
  {
    icon: FlaskConical,
    title: "Soil Testing & Analysis",
    description:
      "Comprehensive laboratory analysis of soil samples to determine nutrient levels, pH balance, organic matter content, and soil texture.",
    features: [
      "Nitrogen (N), Phosphorus (P), Potassium (K) levels",
      "pH and soil acidity assessment",
      "Organic matter content analysis",
      "Micronutrient testing (Zn, Fe, Mn, Cu)",
      "Soil texture classification",
      "Certified lab results with recommendations",
    ],
    image: soilSampleImage,
  },
  {
    icon: MapPin,
    title: "GIS Fertility Mapping",
    description:
      "Advanced spatial analysis using Geographic Information Systems (GIS) to create detailed fertility maps showing nutrient distribution patterns across your farmland.",
    features: [
      "High-resolution fertility maps",
      "Individual maps for N, P, K, and pH",
      "Field boundary delineation",
      "Management zone creation",
      "Digital deliverables (PDF, PNG, GeoTIFF)",
      "Seasonal comparison analysis",
    ],
    image: gisMapImage,
  },
];

const additionalServices = [
  {
    icon: FileSpreadsheet,
    title: "Variable-Rate Application (VRA) Prescriptions",
    description:
      "Custom prescription maps that tell you exactly how much fertilizer to apply at each point of your field, optimized for your equipment.",
  },
  {
    icon: Target,
    title: "Precision Sampling",
    description:
      "Grid-based or zone-based soil sampling with GPS coordinates to ensure accurate and representative data collection across your fields.",
  },
  {
    icon: Layers,
    title: "Multi-Season Tracking",
    description:
      "Track soil health changes over multiple growing seasons with our subscription services and trend analysis reports.",
  },
  {
    icon: TrendingUp,
    title: "Yield Correlation Analysis",
    description:
      "Correlate soil fertility data with yield maps to identify limiting factors and optimize your fertilizer investment.",
  },
  {
    icon: Sprout,
    title: "Crop-Specific Recommendations",
    description:
      "Tailored fertilizer recommendations based on your specific crop requirements, growth stage, and target yield goals.",
  },
  {
    icon: Microscope,
    title: "Advanced Diagnostics",
    description:
      "Deep analysis for problem fields including salinity testing, heavy metal detection, and microbial activity assessment.",
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-earth">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              Precision Agriculture Services
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
              From soil sampling to variable-rate prescriptions, we provide end-to-end precision agriculture solutions tailored for Nigerian farms.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-20 lg:space-y-28">
            {mainServices.map((service, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-leaf-green flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="default" size="lg" asChild>
                    <Link to="/contact">
                      Request This Service
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="rounded-2xl overflow-hidden shadow-strong">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-auto object-cover"
                      width={1024}
                      height={1024}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Additional Services
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mt-4 mb-6">
              Complete Precision Agriculture Suite
            </h2>
            <p className="text-muted-foreground text-lg">
              Beyond mapping and testing, we offer a comprehensive range of services to support your farm's success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-border hover:border-primary/20"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              Contact us for a free consultation. We'll assess your farming needs and recommend the best solution for your operation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Get Free Consultation
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
