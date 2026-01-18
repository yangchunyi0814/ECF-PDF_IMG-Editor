
export const toast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const wrap = document.getElementById('toasts');
    if (!wrap) return;
    
    const t = document.createElement('div');
    t.className = `px-4 py-2 text-xs font-medium rounded-lg shadow-xl mb-2 animate-slide-in flex items-center gap-2 backdrop-blur-md border border-white/10 ${
        type === 'success' ? 'bg-emerald-600/90' : type === 'error' ? 'bg-red-600/90' : 'bg-blue-600/90'
    }`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    t.innerHTML = `<span>${icon}</span> ${message}`;
    
    wrap.appendChild(t);
    
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(20px)';
        t.style.transition = 'all 0.3s ease';
        setTimeout(() => t.remove(), 300);
    }, 3000);
};
