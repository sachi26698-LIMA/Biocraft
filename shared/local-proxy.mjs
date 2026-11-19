// Node/Vite only. This target is never included in a browser bundle.
export function localApiProxy(port=4190) {
  if(!Number.isInteger(port)||port<1||port>65535)throw Error('Invalid local API port');
  const target=`http://127.0.0.1:${port}`;
  return Object.fromEntries(['/api/admin/v1/','/api/status/'].map(path=>[path,{target,changeOrigin:false,xfwd:false}]));
}
