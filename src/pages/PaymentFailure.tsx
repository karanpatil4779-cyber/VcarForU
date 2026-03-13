import { Link, useNavigate } from 'react-router-dom';
import { XCircle, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
          <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-rose-600" />
          </div>

          <h1 className="font-heading text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Payment Failed
          </h1>
          <p className="font-body text-[15px] text-slate-500 leading-relaxed mb-8">
            Your payment could not be processed. No amount has been deducted from your account. Please try again.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full rounded-2xl shadow-primary-200"
              onClick={() => navigate(-1)}
            >
              <RotateCcw className="mr-2 h-5 w-5" /> Try Again
            </Button>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full rounded-2xl">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        <p className="font-body text-[11px] text-slate-400 tracking-wide mt-6">If the issue persists, contact support@vcaru.com</p>
      </div>
    </div>
  );
};

export default PaymentFailure;
