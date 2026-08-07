import {
  CircleCheck,
  Clock3,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

const steps = [
  {
    key: "received",
    label: "Order Received",
    icon: ShoppingBag,
  },
  {
    key: "preparing",
    label: "Preparing",
    icon: Clock3,
  },
  {
    key: "ready",
    label: "Ready for Pickup",
    icon: PackageCheck,
  },
  {
    key: "collected",
    label: "Collected",
    icon: CircleCheck,
  },
];

function StatusTimeline({ currentStatus }) {
  const currentIndex = steps.findIndex(
    (step) => step.key === currentStatus
  );

  return (
    <div className="rounded-3xl border border-[#E7D8C7] bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold text-[#4B2E1F]">
        Order Status
      </h2>

      <div className="space-y-5">

        {steps.map((step, index) => {
          const Icon = step.icon;

         const isCollected = currentStatus === "collected";

const completed = isCollected
  ? index <= currentIndex
  : index < currentIndex;

const active = !isCollected && index === currentIndex;

          return (
            <div
              key={step.key}
              className="flex items-start gap-4"
            >
              {/* Timeline */}
              <div className="flex flex-col items-center">

                <div
                  className={`
                    flex h-12 w-12 items-center justify-center rounded-full border-2 transition
                    ${
                      completed
                        ? "border-green-600 bg-green-600 text-white"
                        : active
                        ? "border-[#6F4E37] bg-[#FFF4E8] animate-pulse text-[#6F4E37]"
                        : "border-[#D7C2AD] bg-white text-gray-400"
                    }
                  `}
                >
                  <Icon size={20} />
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`mt-2 h-10 w-1 rounded-full ${
                      completed
                        ? "bg-green-600"
                        : "bg-[#E7D8C7]"
                    }`}
                  />
                )}

              </div>

              {/* Text */}
              <div className="pt-2">

                <h3
                  className={`font-semibold ${
                    completed || active
                      ? "text-[#4B2E1F]"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {completed
                    ? "Completed"
                    : active
                    ? "In Progress"
                    : "Pending"}
                </p>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}

export default StatusTimeline;