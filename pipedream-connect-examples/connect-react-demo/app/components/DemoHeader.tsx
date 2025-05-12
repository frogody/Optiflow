import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  IoCubeSharp,
  IoFlashOutline,
  IoHelpCircleOutline,
} from "react-icons/io5"
import { SiGithub } from "react-icons/si"

import { PipedreamLogo } from "./PipedreamLogo"

import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAppState } from "@/lib/app-state"




const typeOptions = [
  {
    label: "Actions",
    value: "action",
    icon: <IoCubeSharp className="h-4 w-4 text-neutral-600" />,
    description: "Connect to APIs and perform operations",
  },
  {
    label: "Triggers",
    value: "trigger",
    icon: <IoFlashOutline className="h-4 w-4 text-neutral-600" />,
    description: "React to events and webhooks",
  },
]

export const DemoHeader = () => {
  const {
    selectedComponentType,
    setSelectedComponentType,
    removeSelectedComponentType,
  } = useAppState()
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200">
      <div className="flex items-center gap-x-3">
        <PipedreamLogo className="text-neutral-600 h-[18px] w-auto" />
        <Badge
          variant="outline"
          className="h-6 gap-1.5 px-2 py-0 bg-neutral-50/90 backdrop-blur-xl border-neutral-200/50 text-sm font-medium text-neutral-600"
        >
          connect-demo
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center">
                  <IoHelpCircleOutline className="h-4 w-4 text-neutral-500 hover:text-neutral-600 cursor-help" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                className="w-[480px] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 bg-neutral-100/95 backdrop-blur-xl border border-neutral-200/50 p-4 shadow-sm"
              >
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-800 leading-relaxed text-balance">
                    One SDK, thousands of API integrations for your app or AI agent
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Pipedream Connect provides a TypeScript SDK and REST API to
                    let your users securely connect their accounts and integrate
                    with their favorite tools. Common use cases include:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex gap-x-2 text-sm">
                      <span className="text-neutral-500">▸</span>
                      <span className="text-neutral-700 leading-relaxed">
                        <strong className="font-medium text-neutral-800">
                          Managed authentication:
                        </strong>{" "}
                        Securely manage user credentials and API tokens with
                        built-in OAuth token refresh
                      </span>
                    </li>
                    <li className="flex gap-x-2 text-sm">
                      <span className="text-neutral-500">▸</span>
                      <span className="text-neutral-700 leading-relaxed">
                        <strong className="font-medium text-neutral-800">
                          Actions:
                        </strong>{" "}
                        Connect to APIs and perform operations like sending
                        messages or syncing data
                      </span>
                    </li>
                    <li className="flex gap-x-2 text-sm">
                      <span className="text-neutral-500">▸</span>
                      <span className="text-neutral-700 leading-relaxed">
                        <strong className="font-medium text-neutral-800">
                          Workflow Invocation:
                        </strong>{" "}
                        Write one workflow and run it for all your users
                      </span>
                    </li>
                    <li className="flex gap-x-2 text-sm">
                      <span className="text-neutral-500">▸</span>
                      <span className="text-neutral-700 leading-relaxed">
                        <strong className="font-medium text-neutral-800">
                          AI agents:
                        </strong>{" "}
                        Connect your AI agent to all the tools your customers
                        use and enable it to take actions on their behalf
                      </span>
                    </li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Badge>
        <div className="h-4 w-px bg-neutral-200" />
        <NavigationMenu delayDuration={0}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-7 text-sm gap-1.5 px-2.5 text-neutral-600 hover:text-neutral-800">
                {selectedComponentType === "trigger" ?
                  <IoFlashOutline className="h-4 w-4 text-neutral-600" /> :
                  <IoCubeSharp className="h-4 w-4 text-neutral-600" />
                }
                {selectedComponentType}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-[240px] p-1.5">
                {typeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-sm",
                      option.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-neutral-50"
                    )}
                    value={selectedComponentType}
                    onClick={(type) => {
                      type ? setSelectedComponentType(option.value) : removeSelectedComponentType()
                    }}
                  >
                    {option.icon}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-neutral-700">
                          {option.label}
                        </span>
                        {option.disabled && (
                          <Badge
                            variant="secondary"
                            className="h-5 text-[11px] font-medium bg-neutral-100 text-neutral-500 px-1.5"
                          >
                            Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 truncate">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          className="flex items-center gap-x-2 text-neutral-600 hover:text-neutral-800 border-neutral-200 hover:bg-neutral-50"
          onClick={() => window.open("https://pipedream.com/support", "_blank")}
        >
          Contact us
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-x-2 text-neutral-600 hover:text-neutral-800 border-neutral-200 hover:bg-neutral-50"
          onClick={() => window.open("https://pipedream.com/docs/connect/components", "_blank")}
        >
          Read the docs
        </Button>
        <Button variant="default" className="gap-2" asChild>
          <a
            href="https://github.com/PipedreamHQ/pipedream-connect-examples/tree/master/connect-react-demo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithub className="h-4 w-4" />
            View on GitHub
          </a>
        </Button>
      </div>
    </div>
  )
}
