import Image from 'next/image';

interface ContentSectionProps {
  text: string;
  imageUrls: string[] | null;
}

const ContentSection = ({ text, imageUrls }: ContentSectionProps) => {
  return (
    <>
      <div className="font-pretendard text-xl font-medium break-words whitespace-pre-wrap ">
        {text}
      </div>

      {imageUrls && imageUrls.length > 0 && (
        <div className="mt-4 flex overflow-x-auto gap-6">
          {imageUrls.map((imageUrl, index) => (
            <Image
              key={index}
              src={imageUrl}
              alt={`content-image-${index}`}
              width={300}
              height={400}
              className="w-[300px] h-[400px] object-cover rounded-xl"
            />
          ))}
        </div>
      )}
      <div className="w-full border-b border-gray-15" />
    </>
  );
};

export default ContentSection;
