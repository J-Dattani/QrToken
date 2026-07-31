function TokenCard({ tokenNumber }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border p-8 text-center">

      <p className="text-gray-500 uppercase tracking-widest text-sm">
        Your Token
      </p>

      <h1 className="text-6xl font-bold text-green-600 mt-3">
        {tokenNumber}
      </h1>

      <p className="mt-4 text-gray-600">
        Please wait for your token to be called
      </p>

    </div>
  );
}

export default TokenCard;