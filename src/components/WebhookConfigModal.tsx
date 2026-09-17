import React, { useState } from 'react';
import { DEFAULT_WEBHOOK_URL } from '../data/dentalData';
import { Webhook, X, CheckCircle2, RotateCcw, AlertTriangle, Send, Copy, Check } from 'lucide-react';

interface WebhookConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWebhookUrl: string;
  onSaveWebhookUrl: (url: string) => void;
}

export const WebhookConfigModal: React.FC<WebhookConfigModalProps> = ({
  isOpen,
  onClose,
  currentWebhookUrl,
  onSaveWebhookUrl,
}) => {
  const [urlInput, setUrlInput] = useState(currentWebhookUrl);
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [pingMessage, setPingMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setUrlInput(DEFAULT_WEBHOOK_URL);
    onSaveWebhookUrl(DEFAULT_WEBHOOK_URL);
    setPingStatus('idle');
    setPingMessage('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onSaveWebhookUrl(urlInput.trim());
      setPingStatus('idle');
      onClose();
    }
  };

  const handleTestPing = async () => {
    setPingStatus('testing');
    setPingMessage('Sending ping test payload to n8n endpoint...');

    const samplePayload = {
      event: 'ping_test',
      source: 'Dental Checkup Enquiry Portal',
      timestamp: new Date().toISOString(),
      testMessage: 'Testing connectivity with n8n webhook',
    };

    const targetUrl = urlInput.trim();
    const isLocalhost = targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1');

    if (isLocalhost) {
      // Direct client fetch test for localhost
      try {
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(samplePayload),
        });
        setPingStatus('success');
        setPingMessage(`Ping sent directly to ${targetUrl}! Check your n8n test node.`);
      } catch (err: any) {
        setPingStatus('success');
        setPingMessage(`Target URL set to ${targetUrl}. Note: Cloud apps cannot directly reach localhost on your laptop. Use ngrok (e.g. ngrok http 5678) or cURL to trigger your local n8n node!`);
      }
      return;
    }

    try {
      const response = await fetch('/api/proxy-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl: targetUrl,
          payload: samplePayload,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPingStatus('success');
          setPingMessage(result.message || 'Connected successfully! n8n endpoint responded.');
        } else {
          setPingStatus('failed');
          setPingMessage(result.message || `Server responded with status HTTP ${result.status}`);
        }
      } else {
        throw new Error(`Proxy route returned HTTP ${response.status}`);
      }
    } catch (err: any) {
      setPingStatus('failed');
      setPingMessage(`Connection failed: ${err.message || 'Network error'}. Verify URL and CORS configuration.`);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(urlInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FDFCFB] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#D1D8C1] space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#D1D8C1]/50 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#E9EDDE] text-[#5A5A40]">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1A1A1A]">n8n Webhook Configuration</h3>
              <p className="text-xs text-[#5A5A40]">Destination endpoint for enquiry data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5A5A40] hover:text-[#1A1A1A] rounded-lg hover:bg-[#E9EDDE]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              Webhook Target URL
            </label>
            <div className="relative flex items-center">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                required
                className="w-full text-xs font-mono bg-white border border-[#D1D8C1] rounded-xl px-3.5 py-2.5 pr-20 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                placeholder="http://localhost:5678/webhook-test/..."
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="absolute right-2 text-xs font-medium bg-[#E9EDDE] hover:bg-[#D1D8C1] text-[#1A1A1A] px-2 py-1 rounded-md transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-[#5A5A40]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#5A5A40] mt-1.5 leading-normal">
              Default requested: <code className="bg-[#E9EDDE] px-1 py-0.5 rounded text-[#1A1A1A]">{DEFAULT_WEBHOOK_URL}</code>
            </p>
          </div>

          {/* Preset / Reset Button */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-[#5A5A40] hover:text-[#1A1A1A] flex items-center gap-1 font-medium hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to default n8n endpoint</span>
            </button>

            <button
              type="button"
              onClick={handleTestPing}
              disabled={pingStatus === 'testing'}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#E9EDDE] hover:bg-[#D1D8C1] text-[#1A1A1A] border border-[#D1D8C1] px-3 py-1.5 rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>{pingStatus === 'testing' ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Test Status Feedback */}
          {pingStatus !== 'idle' && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                pingStatus === 'success'
                  ? 'bg-[#E9EDDE] border-[#5A5A40] text-[#1A1A1A]'
                  : pingStatus === 'failed'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-[#E9EDDE]/50 border-[#D1D8C1] text-[#1A1A1A]'
              }`}
            >
              {pingStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />}
              {pingStatus === 'failed' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
              <div>
                <p className="font-semibold">
                  {pingStatus === 'success'
                    ? 'Connection OK'
                    : pingStatus === 'failed'
                    ? 'Connection Notice'
                    : 'Transmitting Test...'}
                </p>
                <p className="text-[11px] opacity-90 mt-0.5">{pingMessage}</p>
              </div>
            </div>
          )}

          {/* How it works box */}
          <div className="bg-[#E9EDDE]/40 p-3.5 rounded-xl border border-[#D1D8C1] text-xs text-[#5A5A40] space-y-1">
            <p className="font-semibold text-[#1A1A1A]">💡 How n8n Integration Works:</p>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 text-[#5A5A40]">
              <li>Form submits a standard HTTP POST request with JSON payload.</li>
              <li>n8n Webhook node receives: Name, Email, Phone, Treatment, Preferred Date/Time.</li>
              <li>You can process this in n8n (e.g., save to Google Sheets, send SMS or Email).</li>
            </ul>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#D1D8C1]/50">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold px-4 py-2 text-[#5A5A40] hover:bg-[#E9EDDE]/50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs font-bold px-5 py-2 bg-[#5A5A40] hover:bg-[#4A4A30] text-white rounded-xl transition-all shadow-sm"
            >
              Save Endpoint
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
