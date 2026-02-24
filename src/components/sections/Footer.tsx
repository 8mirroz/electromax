export function Footer() {
  return (
    <footer className="w-full py-12 bg-neutral-950 text-neutral-300 mt-24">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-white text-lg mb-4">Electromax</h3>
          <p className="text-sm opacity-80">Professional Engineering Systems Integration.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Services</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Fire Alarm (APS)</li>
            <li>Surveillance (SOT)</li>
            <li>Access Control (SKUD)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Company</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>About Us</li>
            <li>Cases</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Contacts</h4>
          <p className="text-sm opacity-80 mb-2">+7 (495) 000-00-00</p>
          <p className="text-sm opacity-80">office@electromax.ru</p>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-neutral-800 text-sm opacity-60 flex justify-between">
        <p>© 2026 Electromax. All rights reserved.</p>
        <p>TIN: 7700000000</p>
      </div>
    </footer>
  );
}
