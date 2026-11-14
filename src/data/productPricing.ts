export type ProductPlanId='weekly'|'monthly'|'lifetime'|'onetime';
export interface ProductPlan {id:ProductPlanId;label:string;priceUsd:number|null;priceNote:string;}
import { gameCatalog } from './gameCatalog';

export function getProductPlans(_slug: string, _locale = 'en'): ProductPlan[] {
  return gameCatalog.plans;
}
export function formatPlanPrice(_usd:number|null):string{return '';}
export function checkoutUrlWithPlan(baseUrl:string,_plan:ProductPlanId):string{return baseUrl;}
