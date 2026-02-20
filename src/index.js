1. Click **"Add file"** → **"Create new file"**
2. In the filename box, type exactly: `src/index.js`
3. Paste the contents below
4. Click **"Commit changes"**

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---
