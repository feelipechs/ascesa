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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.3939198088137!2d-46.23203615343648!3d-23.97952592328583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce0113c2e55817%3A0xc9432c339055b8e3!2sEducasurf!5e1!3m2!1spt-BR!2sbr!4v1773157605405!5m2!1spt-BR!2sbr"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização no Google Maps"
            className="w-full"
          />
        </div>
      </div>
    </section>
  )
}
