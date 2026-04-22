import { useUIStore } from '../../stores/uiStore';
import Button from './Button';

export default function ConfirmDialog() {
  const { confirmDialog, closeConfirm } = useUIStore();
  if (!confirmDialog) return null;

  const { title, message, onConfirm, danger } = confirmDialog;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={closeConfirm}>Batal</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); closeConfirm(); }}>
            Konfirmasi
          </Button>
        </div>
      </div>
    </div>
  );
}
