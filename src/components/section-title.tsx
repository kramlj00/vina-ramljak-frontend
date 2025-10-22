interface IProps {
  title: string;
  description?: string;
}

const SectionTitle = ({ title, description }: IProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-gradient-wine">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
