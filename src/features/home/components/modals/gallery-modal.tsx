import { Dispatch, SetStateAction } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { GalleryCategory } from '../../utils';

interface IProps {
  selectedCategory: GalleryCategory | null;
  setSelectedCategory: Dispatch<SetStateAction<GalleryCategory | null>>;
}

const GalleryModal = ({ selectedCategory, setSelectedCategory }: IProps) => {
  return (
    <Dialog
      open={!!selectedCategory}
      onOpenChange={() => setSelectedCategory(null)}
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-playfair text-3xl text-gradient-wine">
            {selectedCategory?.title}
          </DialogTitle>
        </DialogHeader>
        <Carousel className="w-full">
          <CarouselContent>
            {selectedCategory?.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
