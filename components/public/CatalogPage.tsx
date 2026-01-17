import React, { useState, useEffect } from "react";
import { useCatalog } from "../../hooks/useCatalog";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import { api } from "../../services/api/apiClient";
import { Combo } from "../../types";
import Header from "./Header";
import Footer from "./Footer";
import ProductsCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";
import BusinessProfile from "./BusinessProfile";

const CatalogPage: React.FC = () => {
  const { products, categories, businessInfo, isLoading } = useCatalog();
  const { addComboToCart } = useCart();
  const { showToast } = useToast();
  const [combos, setCombos] = useState<Combo[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadCombos = async () => {
      try {
        const data = await api.get<Combo[]>("/api/public/combos");
        setCombos(data);
      } catch (error) {
        // console.error("Error loading combos:", error);
      }
    };
    loadCombos();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }

  const whatsappNumber = businessInfo?.contact.phone?.replace(/\D/g, "");
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="animate-fade-in">
        <Header />
      </div>

      {/* Perfil del negocio */}
      {businessInfo && <BusinessProfile businessInfo={businessInfo} />}

      {/* Navegación horizontal de categorías - estilo Pedisy */}
      <div className="sticky top-0 bg-black/90 backdrop-blur border-b border-gray-800 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide py-4 px-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`flex-shrink-0 px-4 py-2 font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCategoryId === category.id
                    ? "text-white border-b-2 border-primary"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 flex-grow w-full">
        {/* Sección de Combos */}
        {combos.length > 0 && !selectedCategoryId && (
          <div className="mb-12 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-2">
              🎁 Combos Especiales
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Ahorra con nuestros combos exclusivos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="bg-secondary rounded-lg p-4 border border-gray-800 hover:border-primary transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(228,60,47,0.18)]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-semibold text-lg">
                      {combo.name}
                    </h3>
                    <span className="text-primary font-bold text-xl">
                      ${Math.round(combo.priceCents / 100).toLocaleString("es-AR")}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {combo.items.map((item, idx) => (
                      <div key={idx} className="text-gray-400 text-sm">
                        • {item.qty}x {item.productName}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                    <span className="text-xs text-gray-500">
                      {combo.items.length} productos
                    </span>
                    <button
                      onClick={() => {
                        addComboToCart(combo);
                        showToast(`${combo.name} agregado al carrito`, "success");
                      }}
                      className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categorías de Productos */}
        {categories
          .filter((cat) => !selectedCategoryId || cat.id === selectedCategoryId)
          .map((category) => {
            const categoryProducts = products.filter(
              (p) => p.categoryId === category.id
            );
            if (categoryProducts.length === 0) return null;

            return (
              <div
                key={category.id}
                id={`category-${category.id}`}
                className="mb-12 animate-fade-in-up"
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Todos los combos incluyen papas.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categoryProducts.map((product) => (
                    <ProductsCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
      </main>
      <Footer />
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-glow"
          aria-label="Contactar por WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7"
          >
            <path d="M20.52 3.48A11.82 11.82 0 0012.06 0C5.46.03.1 5.4.12 12c0 2.1.55 4.14 1.6 5.95L0 24l6.23-1.64A11.88 11.88 0 0012.06 24h.01c6.6 0 11.97-5.37 12-11.97a11.88 11.88 0 00-3.55-8.55zm-8.46 18.5a9.9 9.9 0 01-5.06-1.39l-.36-.21-3.7.97.98-3.6-.23-.37a9.86 9.86 0 01-1.52-5.2c0-5.45 4.44-9.9 9.9-9.9a9.86 9.86 0 016.99 2.9 9.83 9.83 0 012.9 6.98c0 5.45-4.45 9.9-9.9 9.9zm5.42-7.4c-.3-.15-1.76-.87-2.04-.96-.27-.1-.46-.15-.66.15s-.76.96-.94 1.16c-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.58-.9-2.17-.23-.55-.47-.48-.66-.49h-.56c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.5s1.06 2.9 1.21 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.28.17-1.41-.08-.13-.27-.2-.57-.35z" />
          </svg>
        </a>
      )}
      <CheckoutModal />
    </div>
  );
};

export default CatalogPage;
