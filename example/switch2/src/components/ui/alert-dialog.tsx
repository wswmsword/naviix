import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import styles from "./style/alert-dialog.module.css";
import { cn } from "@/lib/utils"
import naviix from "../../../../.."
import { BorderAnimeContext } from "@/context";
import clsx from "clsx";

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-[rgb(240,240,240)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-[770px] translate-x-[-50%] translate-y-[-50%] rounded-[4px] border shadow-lg duration-200",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col text-left py-[60px] px-[205px]", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const focusedRef = React.use(BorderAnimeContext);

  React.useEffect(() => {
    const wrapE = wrapRef.current;
    const parentE = wrapE?.parentElement;
    wrapE?.addEventListener("keydown", onKeyDown);
    parentE?.addEventListener("keydown", onKeyDownP);
    const rs = [...(wrapE?.children || [])];
    const nvx = naviix(rs);
    const keyMap = new Map([
      ["ArrowRight", "right"],
      ["ArrowLeft", "left"],
      ["ArrowUp", "up"],
      ["ArrowDown", "down"],
    ])
    return () => {
      wrapE?.removeEventListener("keydown", onKeyDown);
      parentE?.removeEventListener("keydown", onKeyDownP);
    }

    function onKeyDown(e: KeyboardEvent) {
      e.stopImmediatePropagation();
      const focusInfo = nvx.get(e.target) || {};
      const dir = keyMap.get(e.key) as "left" | "right" | "up" | "down";
      if (dir) {
        if (focusInfo[dir])
          focusInfo[dir].id.focus();
        else {
          focusedRef?.current.get(e.target)[dir](true);
        }
      }
    }

    function onKeyDownP(e: KeyboardEvent) {
      e.stopImmediatePropagation();
      (wrapE?.childNodes[0] as HTMLButtonElement).focus();
    }
  }, []);

  return (
    <div
      // onKeyDown={test}
      ref={wrapRef}
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-row border-t border-[rgb(205,205,205)] [&>*:not(:first-child)]:border-l [&>*:not(:first-child)]:border-[rgb(205,205,205)]",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {

  const focusedRef = React.use(BorderAnimeContext);

  const [focused, setF] = React.useState(false);
  const [loadedFocus, setL] = React.useState(false);

  const [noL, setNL] = React.useState(false);
  const [noR, setNR] = React.useState(false);
  const [noU, setNU] = React.useState(false);
  const [noD, setND] = React.useState(false);

  const fadeout = loadedFocus === true && focused === false;

  React.useEffect(() => {
    if (focused) setL(true);
  }, [focused]);

  return (
    <AlertDialogPrimitive.Action
      onFocus={onFocus}
      onBlur={onBlur}
      ref={e => {
        if (e) {
          focusedRef?.current.set(e, {
            left: setNL,
            right: setNR,
            up: setNU,
            down: setND,
          });
        }
      }}
      className={cn("relative w-full h-[70px] text-[rgb(63,84,209)] text-2xl outline-none focus:bg-white", className)}
      {...props}
    >
      {children}
      {(loadedFocus || focused) && <>
        <span
          className={`absolute -inset-0.5 text-[0px] pointer-events-none ${clsx({ [styles.l]: noL, [styles.r]: noR, [styles.u]: noU, [styles.d]: noD })}`}
          onAnimationEndCapture={onFocusAnimeEnd}>
          <span
            className={`block w-full h-full ${styles.fb} ${fadeout ? styles.op : ""}`}
            onTransitionEnd={unloadFocus}></span>
        </span>
      </>}
    </AlertDialogPrimitive.Action>
  )

  function onFocusAnimeEnd(e: React.AnimationEvent) {
    if ([styles.reboundR, styles.reboundL, styles.reboundU, styles.reboundD].includes(e.animationName)) {
      setNL(false);
      setNR(false);
      setNU(false);
      setND(false);
    }
  }

  function unloadFocus() {
    setL(false);
  }

  function onFocus() {
    setF(true);
  }

  function onBlur() {
    setF(false);
  }
}

function AlertDialogCancel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {

  const focusedRef = React.use(BorderAnimeContext);

  const [focused, setF] = React.useState(false);
  const [loadedFocus, setL] = React.useState(false);

  const [noL, setNL] = React.useState(false);
  const [noR, setNR] = React.useState(false);
  const [noU, setNU] = React.useState(false);
  const [noD, setND] = React.useState(false);

  const fadeout = loadedFocus === true && focused === false;

  React.useEffect(() => {
    if (focused) setL(true);
  }, [focused]);

  return (
    <AlertDialogPrimitive.Cancel
      onFocus={onFocus}
      onBlur={onBlur}
      ref={e => {
        if (e) {
          focusedRef?.current.set(e, {
            left: setNL,
            right: setNR,
            up: setNU,
            down: setND,
          });
        }
      }}
      className={cn("relative w-full h-[70px] text-[rgb(63,84,209)] text-2xl outline-none focus:bg-white", className)}
      {...props}
    >
      {children}
      {(loadedFocus || focused) && <>
        <span
          className={`absolute -inset-0.5 text-[0px] pointer-events-none ${clsx({ [styles.l]: noL, [styles.r]: noR, [styles.u]: noU, [styles.d]: noD })}`}
          onAnimationEndCapture={onFocusAnimeEnd}>
          <span
            className={`block w-full h-full ${styles.fb} ${fadeout ? styles.op : ""}`}
            onTransitionEnd={unloadFocus}></span>
        </span>
      </>}
    </AlertDialogPrimitive.Cancel>
  )

  function onFocusAnimeEnd(e: React.AnimationEvent) {
    if ([styles.reboundR, styles.reboundL, styles.reboundU, styles.reboundD].includes(e.animationName)) {
      setNL(false);
      setNR(false);
      setNU(false);
      setND(false);
    }
  }

  function unloadFocus() {
    setL(false);
  }

  function onFocus() {
    setF(true);
  }

  function onBlur() {
    setF(false);
  }
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
