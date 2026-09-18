import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import NotFound from "@/pages/not-found";
import WebGLStory from "@/pages/WebGLStory";
import Pricing from "@/pages/Pricing";
import CheckoutWizard from "@/pages/CheckoutWizard";
import ProductionRights from "@/pages/ProductionRights";

const Home = lazy(() => import("@/pages/home"));
const HomeSimple = lazy(() => import("@/pages/home-simple"));
const HomeFixed = lazy(() => import("@/pages/home-fixed"));
const HomePremium = lazy(() => import("@/pages/home-premium"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={WebGLStory} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/checkout" component={CheckoutWizard} />
      <Route path="/production-rights" component={ProductionRights} />
      <Route path="/premium">
        <Suspense fallback={null}>
          <HomePremium />
        </Suspense>
      </Route>
      <Route path="/full">
        <Suspense fallback={null}>
          <Home />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
