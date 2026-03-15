
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { CloseIcon, TrashIcon } from './icons';

interface DeleteAccountModalProps {
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose }) => {
  const { deleteAccount } = useAuth();
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
        showToast('Password is required to delete your account.', 'error');
        return;
    }
    setIsProcessing(true);
    const result = await deleteAccount(password);
    if (!result.success) {
        setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm" role="dialog">
      <div className="relative w-full max-w-md p-8 m-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500" title="Close"><CloseIcon className="w-6 h-6" /></button>
        <div className="text-center mb-6">
            <TrashIcon className="w-10 h-10 mx-auto text-red-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-3">Delete Account</h2>
        </div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">Permanent action. Your account will be deleted after one week. Please enter your password to confirm.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={isProcessing} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="••••••••" />
            </div>
            <div className="pt-2 flex flex-col sm:flex-row-reverse gap-3">
              <button type="submit" className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md disabled:bg-red-400">
                {isProcessing ? 'Deleting...' : 'Delete My Account'}
              </button>
               <button type="button" onClick={onClose} className="w-full py-2 px-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 rounded-md">Cancel</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
