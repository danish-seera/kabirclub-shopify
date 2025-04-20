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
  const buttonClasses = 'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white text-[22px] font-quicksand';
  const disabledClasses = 'btn-cart-disabled cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Please select an option
      </button>
    );
  }

  const productUrl = `https://kabirclub.com/product/${productHandle}`;
  const whatsappMessage = `Hi KabirClub, I am interested in your products. ${productUrl}`;
  const encodedMessage = encodeURIComponent(whatsappMessage);

  return (
    <a
      href={`https://wa.me/917991812899?text=${encodedMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true
      })}
    >
      Contact Us
    </a>
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
