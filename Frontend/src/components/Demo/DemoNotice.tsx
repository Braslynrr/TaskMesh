

export function DemoNotice() {
  return (
    <div className="border border-gray-700 rounded-2xl p-4 bg-gray-800 text-gray-100 shadow-sm max-w-2xl">

      <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
        🚧 TaskMesh Demo
      </h2>

      <p className="text-sm text-gray-300 mb-2">
        This is a public demo environment. You can login using the demo accounts
        below or create your own account. <span className="text-yellow-200">Data may be periodically reset.</span>
      </p>

      <p className="text-sm text-gray-400 mb-3">
        <span className="font-medium text-gray-200">Tip:</span> Open the same
        taskboard in multiple browser tabs to see realtime updates, or ask a
        friend to join the same board to test collaboration.
      </p>

      <p className="text-sm text-gray-400 mb-4">
        <span className="text-yellow-200">Mobile experience is limited due to drag & drop and other interactions.</span>
      </p>


      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-blue-400 hover:text-blue-300 transition">
          Show demo accounts
        </summary>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="text-left px-3 py-2">Username</th>
                <th className="text-left px-3 py-2">Password</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              <tr className="hover:bg-gray-700/40">
                <td className="px-3 py-2">Guest</td>
                <td className="px-3 py-2 font-mono">guest123</td>
              </tr>

              <tr className="hover:bg-gray-700/40">
                <td className="px-3 py-2">Guest 2</td>
                <td className="px-3 py-2 font-mono">guest212</td>
              </tr>

              <tr className="hover:bg-gray-700/40">
                <td className="px-3 py-2">Guest 3</td>
                <td className="px-3 py-2 font-mono">guest312</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}