const steps = [
  "received",
  "preparing",
  "ready",
  "collected",
];

function StatusTimeline({ currentStatus }) {
  const currentIndex = steps.indexOf(currentStatus);
console.log("Current Status:", currentStatus);
console.log("Current Index:", currentIndex);
  return (
    <div className="bg-white rounded-2xl shadow-md border p-6">

      <h2 className="text-xl font-semibold mb-6">
        Order Status
      </h2>

      <div className="space-y-5">

        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-4"
          >

            <div
           className={
  index <= currentIndex
    ? "w-5 h-5 rounded-full bg-green-600"
    : "w-5 h-5 rounded-full bg-gray-300"
}
            />

            <p
              className={
  index <= currentIndex
    ? "capitalize font-semibold text-black"
    : "capitalize text-gray-400"
}
            >
              {step}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default StatusTimeline;