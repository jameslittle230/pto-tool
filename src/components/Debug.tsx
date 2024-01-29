export const Debug = ({ value, label }: { value: any; label?: string }) => {
  return (
    <details className="flex flex-col">
      <summary className="text-sm font-bold text-gray-600">{label}</summary>
      <pre className="text-xs font-mono text-gray-500">
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  );
};
