import Link from 'next/link';
import { Button } from '../components/Button';
import { FaArrowRight, FaShieldAlt, FaCheckCircle, FaTruck, FaShippingFast, FaPrint, FaStar, FaUsers, FaAward, FaClock, FaCheck, FaQuoteLeft, FaFire } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

async function getCategories() {
  try {
    const res = await fetch('http://localhost:5000/api/categories', { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    return [];
  }
}

async function getPopularProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/products', { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).slice(0, 8); // Top 8 Trending
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();
  const popularProducts = await getPopularProducts();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">

      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-[80px] animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-primary-500/5 rounded-full blur-[150px]"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-primary-400 rounded-full animate-bounce delay-500"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-1500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-pink-500/20 text-white font-semibold text-sm border border-white/10 backdrop-blur-sm">
              <FaStar className="w-4 h-4 text-yellow-300" />
              India's #1 Commercial Printing Service
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Your Brand,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-pink-500 to-purple-500 animate-gradient-x">
                  Printed Perfectly.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 font-medium max-w-lg leading-relaxed">
                From business cards to massive banners, get enterprise-grade prints with lightning-fast delivery across India. Trusted by 10,000+ businesses.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#categories">
                <Button size="lg" className="rounded-xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.4)] hover:-translate-y-1 transition-all px-8 py-6 text-lg w-full font-bold bg-gradient-to-r from-primary-600 to-primary-700">
                  Start Designing
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg w-full font-bold backdrop-blur-sm">
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-pink-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-300">
                <div className="font-semibold">10,000+ Happy Customers</div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <FaStar key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
                  <span className="ml-1">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-end relative">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-pink-500 rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 scale-110"></div>

              {/* Main Image */}
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <img
                  src="/images/high-quality_professional_illustration_representing_Printing_Services.png"
                  alt="Professional Printing Services"
                  className="w-full max-w-md rounded-2xl shadow-2xl object-cover border border-white/10 group-hover:-translate-y-2 transition-transform duration-500"
                />

                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-xl p-4 animate-bounce delay-500">
                  <div className="flex items-center gap-2">
                    <FaCheck className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-bold text-slate-900">Quality Assured</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-primary-500 to-pink-500 text-white rounded-xl shadow-xl p-4 animate-bounce delay-1000">
                  <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    <span className="text-sm font-bold">24hr Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-black text-primary-600">10K+</div>
              <div className="text-sm text-slate-600 font-medium">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-black text-primary-600">50K+</div>
              <div className="text-sm text-slate-600 font-medium">Prints Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-black text-primary-600">24hrs</div>
              <div className="text-sm text-slate-600 font-medium">Average Delivery</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-black text-primary-600">4.9/5</div>
              <div className="text-sm text-slate-600 font-medium">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get your professional prints in just 3 simple steps. From design to delivery, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-black text-white">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Choose & Customize</h3>
                <p className="text-slate-600 leading-relaxed">
                  Browse our categories, select your product, and customize with your design, text, and specifications.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-black text-white">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Review & Approve</h3>
                <p className="text-slate-600 leading-relaxed">
                  Preview your design, make any final adjustments, and approve for printing. Our team ensures perfection.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-black text-white">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Delivery</h3>
                <p className="text-slate-600 leading-relaxed">
                  Professional printing begins immediately. Your order ships within 24 hours and arrives ready to use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section id="categories" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Explore Categories</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover our comprehensive range of professional printing services. From business essentials to marketing materials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {categories.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">Loading categories...</p>
              </div>
            ) : categories.map((cat: any, index: number) => (
              <Link
                href={`/category/${cat.slug}`}
                key={cat.slug}
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/60 hover:border-primary-300 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={cat.image?.startsWith('http') ? cat.image : cat.image || '/images/placeholder.png'}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-slate-900">
                    {cat.name}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
                      <span className="text-slate-900 font-bold">Explore {cat.name}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Professional {cat.name.toLowerCase()} printing services with premium quality and fast delivery.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Trending Products</h2>
              <p className="text-lg text-slate-600">Most popular printing services chosen by our customers</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors mt-4 sm:mt-0">
              View All Products <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((p: any, index: number) => (
              <div
                key={p.slug}
                className="group bg-white rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-2xl hover:-translate-y-3 hover:border-primary-200 transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image?.startsWith('http') ? p.image : (p.image || '/images/placeholder.png')}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={p.name}
                    />
                  </div>

                  {/* Featured Badge */}
                  {index < 2 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg inline-flex items-center gap-1">
                      <FaFire className="w-3.5 h-3.5" /> Popular
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link href={`/product/${p.slug}`}>
                      <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-50 shadow-lg">
                        Customize Now
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full mb-3">
                      {p.category}
                    </span>
                    <h4 className="font-bold text-lg text-slate-900 leading-tight mb-2 line-clamp-2">
                      {p.name}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {p.description || 'Professional printing service with premium quality materials and fast delivery.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">Starting at</span>
                      <span className="font-black text-xl text-slate-900">₹{p.basePrice}</span>
                    </div>
                    <Link href={`/product/${p.slug}`}>
                      <Button size="sm" className="rounded-xl px-5 py-2 font-bold shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-shadow">
                        Customize
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what businesses across India say about our printing services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/50">
              <FaQuoteLeft className="w-8 h-8 text-primary-500 mb-6" />
              <p className="text-slate-700 font-medium leading-relaxed mb-6">
                "Outstanding quality and incredibly fast delivery! Our business cards arrived within 24 hours and the print quality exceeded our expectations. Highly recommended!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <div className="font-bold text-slate-900">Rajesh Kumar</div>
                  <div className="text-sm text-slate-600">CEO, TechStart Solutions</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/50">
              <FaQuoteLeft className="w-8 h-8 text-primary-500 mb-6" />
              <p className="text-slate-700 font-medium leading-relaxed mb-6">
                "Saksham Printers transformed our marketing materials. The banner we ordered for our product launch was stunning and helped us stand out from the competition."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <div className="font-bold text-slate-900">Priya Sharma</div>
                  <div className="text-sm text-slate-600">Marketing Head, FashionHub</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/50">
              <FaQuoteLeft className="w-8 h-8 text-primary-500 mb-6" />
              <p className="text-slate-700 font-medium leading-relaxed mb-6">
                "Professional service from start to finish. The team was responsive, the quality was impeccable, and the delivery was on time. Our go-to printing partner!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <div className="font-bold text-slate-900">Amit Patel</div>
                  <div className="text-sm text-slate-600">Owner, Patel Enterprises</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Trust Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">Why Choose Saksham Printers?</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              We're not just another printing service. We're your brand's visual storytelling partner.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-6 group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaShieldAlt className="w-10 h-10 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-xl mb-3 text-white">100% Secure Ordering</h4>
                <p className="text-slate-300 font-medium leading-relaxed">
                  Bank-grade encryption protects your data. Your designs and payment information are completely secure.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaAward className="w-10 h-10 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-xl mb-3 text-white">Premium Quality Guarantee</h4>
                <p className="text-slate-300 font-medium leading-relaxed">
                  Every print undergoes rigorous quality checks. Not satisfied? We'll reprint at no extra cost.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaTruck className="w-10 h-10 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-xl mb-3 text-white">Pan-India Fast Delivery</h4>
                <p className="text-slate-300 font-medium leading-relaxed">
                  Lightning-fast delivery across India. Most orders arrive within 24-48 hours of approval.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 text-slate-300">
              <FaCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="font-medium">Free Design Consultation</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <FaCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="font-medium">Bulk Order Discounts</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <FaCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="font-medium">24/7 Customer Support</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <FaCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="font-medium">Eco-Friendly Materials</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black tracking-tight mb-6">Ready to Bring Your Ideas to Life?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses who trust Saksham Printers for their professional printing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#categories">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-slate-50 px-8 py-4 text-lg font-bold shadow-xl">
                Start Your Order
              </Button>
            </Link>
            <Link href="/track">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold">
                Track Existing Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
