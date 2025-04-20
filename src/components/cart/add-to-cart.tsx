'use client';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

function ContactUsButton({
  availableForSale,
  selectedVariantId,
  productHandle
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  productHandle: string;
}) {
  const buttonClasses = 'relative flex items-center justify-center rounded-[16px] border-2 border-darkPurple bg-lightPurple px-[24px] py-[12px] font-quicksand text-[20px] font-medium text-darkPurple transition-all duration-300 hover:bg-purple hover:text-white w-fit';
  const disabledClasses = 'btn-cart-disabled cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <div className="flex justify-center">
        <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
          Out Of Stock
        </button>
      </div>
    );
  }

  if (!selectedVariantId) {
    return (
      <div className="flex justify-center">
        <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
          Please select an option
        </button>
      </div>
    );
  }

  const productUrl = `https://kabirclub.com/product/${productHandle}`;
  const whatsappMessage = `Hi KabirClub, I am interested in your products. ${productUrl}`;
  const encodedMessage = encodeURIComponent(whatsappMessage);

  return (
    <div className="flex justify-center">
      <a
        href={`https://wa.me/917991812899?text=${encodedMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        Contact Us
      </a>
    </div>
  );
}

export function AddToCart({
  variants,
  availableForSale,
  productHandle
}: {
  variants: any[];
  availableForSale: boolean;
  productHandle: string;
}) {
  const searchParams = useSearchParams();
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const variant = variants.find((variant: any) =>
    variant.selectedOptions.every(
      (option: any) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariantId;

  return <ContactUsButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} productHandle={productHandle} />;
}
