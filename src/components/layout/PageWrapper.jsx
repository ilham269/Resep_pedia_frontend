import Navbar from './Navbar';
import Footer from './Footer';
import ConfirmDialog from '../ui/ConfirmDialog';
import SearchModal from '../shared/SearchModal';

export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ConfirmDialog />
      <SearchModal />
    </div>
  );
}
