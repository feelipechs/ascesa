export function ContactMap() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold">Nossa Localização</h2>
          <p className="mt-2 text-muted-foreground">
            Venha nos visitar ou encontre a melhor rota até nosso endereço.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2894.2377401091253!2d-46.29141333318127!3d-23.942361280494016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce0323ea795f3f%3A0xb5b373e4690c2e62!2zQXNzb2NpYcOnw6NvIEFzY2VzYQ!5e0!3m2!1spt-BR!2sbr!4v1779920776025!5m2!1spt-BR!2sbr"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização no Google Maps"
            className="w-full"
          ></iframe>
        </div>
      </div>
    </section>
  )
}
