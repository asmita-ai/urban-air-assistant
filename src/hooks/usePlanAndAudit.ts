import { useState, useCallback } from 'react';
import { AQIData, HouseholdProfile, RoutinePlan, IAQAuditResult } from '@/types';

export function usePlanAndAudit() {
  const [plan, setPlan] = useState<RoutinePlan | null>(null);
  const [audit, setAudit] = useState<IAQAuditResult | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [isLoadingAudit, setIsLoadingAudit] = useState<boolean>(false);

  const fetchPlan = useCallback(async (currentAQI: AQIData, currentProfile: HouseholdProfile) => {
    setIsLoadingPlan(true);
    try {
      const res = await fetch('/api/ai/routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aqiData: currentAQI, profile: currentProfile }),
      });
      if (!res.ok) throw new Error('Failed to fetch routine plan');
      const planData: RoutinePlan = await res.json();
      setPlan(planData);
    } catch {
      // Handled gracefully
    } finally {
      setIsLoadingPlan(false);
    }
  }, []);

  const fetchAudit = useCallback(async (currentAQI: AQIData, currentProfile: HouseholdProfile) => {
    setIsLoadingAudit(true);
    try {
      const res = await fetch('/api/ai/iaq-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aqiData: currentAQI, profile: currentProfile }),
      });
      if (!res.ok) throw new Error('Failed to fetch IAQ audit');
      const auditData: IAQAuditResult = await res.json();
      setAudit(auditData);
    } catch {
      // Handled gracefully
    } finally {
      setIsLoadingAudit(false);
    }
  }, []);

  const syncPlanAndAudit = useCallback(
    (currentAQI: AQIData, currentProfile: HouseholdProfile) => {
      fetchPlan(currentAQI, currentProfile);
      fetchAudit(currentAQI, currentProfile);
    },
    [fetchPlan, fetchAudit]
  );

  return {
    plan,
    audit,
    isLoadingPlan,
    isLoadingAudit,
    fetchPlan,
    fetchAudit,
    syncPlanAndAudit,
  };
}
