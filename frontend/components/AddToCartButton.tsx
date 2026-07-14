interface AddToCartButtonProps {
  addToCart: () => void;
  isAdded: boolean;
}

export default function AddToCartButton({ addToCart, isAdded }: AddToCartButtonProps) {

  return (
    <button className="bg-[#ee4a62] hover:bg-[#fff] hover:text-[#181818] text-white px-4 py-2 rounded-sm" onClick={(event) => {event.stopPropagation(); addToCart()}}>
      {isAdded ? 'Added to Cart' : 'Add to Cart'}
      <svg className="inline-block ml-1.5 mb-1 w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  );
}