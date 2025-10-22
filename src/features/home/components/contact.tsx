"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-gradient-wine">
            {t("contact.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("contact.description")}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="glass rounded-lg p-8">
              <h3 className="font-playfair text-2xl font-bold mb-6 text-gradient-wine">
                {t("contact.getInTouch")}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">
                      {t("contact.address")}
                    </h4>
                    <p className="text-muted-foreground">
                      Vinum Bibens
                      <br />
                      {t("contact.region")}
                      <br />
                      {t("contact.croatia")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">{t("contact.phone")}</h4>
                    <p className="text-muted-foreground">
                      +385 (0) XX XXX XXXX
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-muted-foreground">info@vinumbibens.hr</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="glass rounded-lg overflow-hidden h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1246.0385592642033!2d16.201952698624744!3d43.86646430286924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2shr!4v1761117800134!5m2!1sen!2shr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vinum Bibens Winery Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
