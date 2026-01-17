import React, { useState } from "react";
import { Products } from "../../types";
import { getProductsImageUrl } from "../../services/api/apiClient";
import ProductDetailModal from "./ProductDetailModal";

interface ProductsCardProps {
  product: Products;
}

const ProductsCard: React.FC<ProductsCardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageUrl = product.hasImage
    ? getProductsImageUrl(product.id)
    : "/placeholder.png";

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group bg-gray-900 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer text-left border border-gray-800 hover:border-primary hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <div className="relative">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.png";
            }}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white">{product.name}</h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2 flex-grow">
            {product.description}
          </p>
          <div className="mt-3 flex justify-between items-center">
            <p className="text-xl font-bold text-white">
              ${(product.priceCents / 100).toLocaleString("es-AR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </button>

      {isModalOpen && (
        <ProductDetailModal
          product={product}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProductsCard;
