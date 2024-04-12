import { MdOutlineDownloadDone } from 'react-icons/md';

export default function AddedToCartMessage() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex h-[7.3rem] items-end justify-center">
      <span className="flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white p-1 font-bold text-green-500">
        Product added to cart <MdOutlineDownloadDone />
      </span>
    </div>
  );
}
