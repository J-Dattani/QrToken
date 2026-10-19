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

  const isCollected = currentStatus === "collected";

  return (
    <div className="rounded-3xl border border-[#E7D8C7] bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#4B2E1F]">
            Order Status
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track your order progress
          </p>
        </div>

        {/* Current Status */}
        {currentIndex >= 0 && (
          <span
            className={`
              rounded-full
              px-3
              py-1.5
              text-xs
              font-semibold
              ${
                isCollected
                  ? "bg-green-100 text-green-700"
                  : "bg-[#FFF4E8] text-[#6F4E37]"
              }
            `}
          >
            {isCollected
              ? "Completed"
              : steps[currentIndex].label}
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-5">

        {steps.map((step, index) => {
          const Icon = step.icon;

          const completed = isCollected
            ? index <= currentIndex
            : index < currentIndex;

          const active =
            !isCollected && index === currentIndex;


          return (
            <div
              key={step.key}
              className="flex items-start gap-4"
            >

              {/* Timeline Column */}
              <div className="flex flex-col items-center">

                {/* Icon */}
                <div
                  className={`
                    relative
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    transition-all
                    duration-300

                    ${
                      completed
                        ? "border-green-600 bg-green-600 text-white shadow-sm"

                        : active
                        ? "border-[#6F4E37] bg-[#FFF4E8] text-[#6F4E37] shadow-md ring-4 ring-[#FFF4E8]"

                        : "border-[#D7C2AD] bg-white text-gray-400"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    strokeWidth={active || completed ? 2.3 : 2}
                  />

                  {/* Active Indicator */}
                  {active && (
                    <span
                      className="
                        absolute
                        -right-0.5
                        -top-0.5
                        h-3
                        w-3
                        rounded-full
                        border-2
                        border-white
                        bg-[#C68E17]
                      "
                    />
                  )}
                </div>

                {/* Connector */}
                {index !== steps.length - 1 && (
                  <div
                    className={`
                      mt-2
                      h-10
                      w-1
                      rounded-full
                      transition-colors
                      duration-500
                      ${
                        completed
                          ? "bg-green-600"
                          : "bg-[#E7D8C7]"
                      }
                    `}
                  />
                )}

              </div>

              {/* Content */}
              <div className="min-w-0 pt-1">

                <h3
                  className={`
                    font-semibold
                    transition-colors
                    ${
                      completed || active
                        ? "text-[#4B2E1F]"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.label}
                </h3>

                <p
                  className={`
                    mt-1
                    text-sm
                    ${
                      active
                        ? "font-medium text-[#6F4E37]"
                        : completed
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  `}
                >
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