import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAgency();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border text-sm animate-in slide-in-from-top-4 duration-200 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : isError
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <p className="leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
