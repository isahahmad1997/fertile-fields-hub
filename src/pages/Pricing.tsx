import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, HelpCircle } from "lucide-react";

const plans = [
  {
    name: "Basic",
    description: "Essential soil testing and mapping for small farms",
    pricePerHa: "₦15,000",
    minHectares: "10",
    features: [
      "Soil testing (N, P, K, pH)",
      "Basic fertility maps (4 maps)",
      "PDF deliverables",
      "Email support",
      "One-time service",
    ],
    notIncluded: [
      "VRA prescription maps",
      "Micronutrient testing",
      "Client portal access",
      "Priority support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    description: "Complete precision package for commercial farms",
    pricePerHa: "₦25,000",
    minHectares: "50",
    features: [
      "Full soil analysis (N, P, K, pH, OM)",
      "Complete fertility maps (6 maps)",
      "VRA prescription maps",
      "PDF + PNG deliverables",
      "Client portal access",
      "Phone & email support",
      "Fertilizer cost analysis",
    ],
    notIncluded: [
      "Micronutrient testing",
      "Multi-season tracking",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Premium subscription for large-scale operations",
    pricePerHa: "₦35,000",
    minHectares: "200",
    features: [
      "Complete soil analysis + micronutrients",
      "All fertility & VRA maps",
      "GeoTIFF files for equipment",
      "Dedicated client portal",
      "Priority phone support",
      "Multi-season tracking",
      "Quarterly soil monitoring",
      "Dedicated account manager",
      "Custom report formats",
    ],
    notIncluded: [],
    popular: false,
  },
];

const addOns = [
  { name: "Micronutrient Testing (Zn, Fe, Mn, Cu, B)", price: "₦3,000/ha" },
  { name: "Organic Matter Map", price: "₦2,000/ha" },
  { name: "Yield Correlation Analysis", price: "₦5,000/ha" },
  { name: "Rush Service (48hr delivery)", price: "+30%" },
  { name: "On-site Agronomist Consultation", price: "₦50,000/visit" },
];

const faqs = [
  {
    question: "What is the minimum farm size for service?",
    answer:
      "Our minimum service area is 10 hectares for Basic plans and 50 hectares for Pro plans. For smaller farms, please contact us for custom pricing.",
  },
  {
    question: "How long does the entire process take?",
    answer:
      "From sampling to delivery, the standard turnaround is 7-10 business days. Rush service can reduce this to 48 hours after lab results are received.",
  },
  {
    question: "What equipment is compatible with VRA maps?",
    answer:
      "We can export prescription maps compatible with John Deere, Case IH, AGCO, and most major precision agriculture equipment. We also provide PDF maps for manual application.",
  },
  {
    question: "Do you service all states in Nigeria?",
    answer:
      "Yes, we provide services across all 36 states. Logistics costs may vary based on location. Major agricultural zones have reduced transportation fees.",
  },
  {
    question: "Can I pay in installments?",
    answer:
      "For Enterprise clients, we offer flexible payment plans. Contact us to discuss options that work for your operation.",
  },
];

export default function Pricing() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-earth">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Pricing
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              Transparent, Per-Hectare Pricing
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Choose the plan that fits your farm size and needs. All prices are per hectare with volume discounts available.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-6 lg:p-8 border ${
                  plan.popular
                    ? "border-primary bg-card shadow-strong"
                    : "border-border bg-card shadow-soft"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.pricePerHa}
                    </span>
                    <span className="text-muted-foreground">/hectare</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Minimum {plan.minHectares} ha
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="font-semibold text-foreground text-sm">
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-leaf-green flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded.length > 0 && (
                    <>
                      <p className="font-semibold text-muted-foreground text-sm pt-4">
                        Not included:
                      </p>
                      <ul className="space-y-2">
                        {plan.notIncluded.map((item, nIndex) => (
                          <li
                            key={nIndex}
                            className="flex items-center gap-2 text-muted-foreground text-sm"
                          >
                            <span className="w-5 h-5 flex items-center justify-center">
                              —
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <Button
                  variant={plan.popular ? "accent" : "outline"}
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link to="/contact">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Volume Discount Note */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Volume discounts available:</span>{" "}
              500+ ha (10% off) • 1,000+ ha (15% off) • 2,500+ ha (20% off)
            </p>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                Add-Ons
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4 mb-6">
                Enhance Your Package
              </h2>
              <p className="text-muted-foreground">
                Customize your service with these optional add-ons.
              </p>
            </div>

            <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
              {addOns.map((addon, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center px-6 py-4 ${
                    index !== addOns.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="text-foreground">{addon.name}</span>
                  <span className="font-semibold text-foreground">
                    {addon.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                FAQs
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4 mb-6">
                Common Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <div className="flex gap-3">
                    <HelpCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6">
              Need a Custom Quote?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              Contact us with your farm details and we'll provide a tailored proposal within 24 hours.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Get Custom Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
