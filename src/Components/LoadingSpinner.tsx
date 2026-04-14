export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-96 py-12 bg-white">
      <div className="relative w-12 h-12">
        {/* Outer spinning ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500"
          style={{
            animation: 'spin 1s linear infinite',
          }}
        />
        {/* Middle spinning ring with delay */}
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-400"
          style={{
            animation: 'spin 1.5s linear infinite reverse',
          }}
        />
        {/* Inner spinning ring */}
        <div
          className="absolute inset-4 rounded-full border-2 border-transparent border-t-blue-300"
          style={{
            animation: 'spin 2s linear infinite',
          }}
        />
      </div>
    </div>
  )
}
