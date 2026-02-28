import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shirt } from 'lucide-react';

const offers = [
  {
    name: 'Basic Pack',
    price: '149',
    originalPrice: '',
    items: 1,
    tag: 'Basic Offer',
    tagColor: 'bg-orange-500',
    borderColor: 'border-gray-300',
    buttonClasses: 'bg-white text-gray-800 border-2 border-gray-800 hover:bg-black hover:text-white',
  },
  {
    name: 'Pack 2',
    price: '269',
    originalPrice: '298',
    items: 2,
    tag: 'Most Popular',
    tagColor: 'bg-red-500',
    borderColor: 'border-red-500',
    buttonClasses: 'bg-white text-red-500 border-2 border-red-500 hover:bg-black hover:text-white',
  },
  {
    name: 'Pack 3',
    price: '349',
    originalPrice: '447',
    items: 3,
    tag: 'Best Value',
    tagColor: 'bg-yellow-400',
    borderColor: 'border-yellow-400',
    buttonClasses: 'bg-white text-gray-800 border-2 border-gray-800 hover:bg-black hover:text-white',
  },
];

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl p-8 bg-white rounded-lg shadow-2xl">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-4xl font-extrabold text-gray-900 tracking-tight">
            New Bundle Offers
          </DialogTitle>
          <DialogDescription className="mt-2 text-lg text-gray-600">
            Save more with every bundle. Choose your pack and enjoy the discount and free delivery!
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.name}
              className={`relative border-2 ${offer.borderColor} rounded-xl p-6 flex flex-col text-center transition-transform transform hover:scale-105`}
            >
              <div
                className={`absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 text-white text-sm font-semibold rounded-full ${offer.tagColor}`}
              >
                {offer.tag}
              </div>
              <div className="flex justify-center items-center my-6">
                {[...Array(offer.items)].map((_, i) => (
                  <Shirt key={i} className="w-12 h-12 mx-1 text-gray-800" />
                ))}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{offer.name}</h3>
              <div className="my-4">
                <span className="text-5xl font-extrabold text-gray-900">{offer.price}</span>
                <span className="text-lg font-medium text-gray-500"> DH</span>
                {offer.originalPrice && (
                  <span className="ml-2 text-lg text-gray-400 line-through">
                    {offer.originalPrice} DH
                  </span>
                )}
              </div>
              <p className="text-green-600 font-semibold mb-6">✓ Free Delivery</p>
              <Button
                className={`w-full mt-auto font-bold py-3 rounded-lg transition-all duration-300 ${offer.buttonClasses}`}
              >
                Discover Bundles
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}