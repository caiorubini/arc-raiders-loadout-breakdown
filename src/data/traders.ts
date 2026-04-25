import { RECYCLE_SOURCES } from "./items";
import { GameItem, TraderId } from "@/types/game";

/**
 * AUTO-GENERATED from wiki-data.json by scripts/generate-data.mjs
 * Last synced: 2026-04-25T15:31:40.742Z
 * Do not edit manually — run: npm run sync
 */

export type { TraderId };

export interface TraderEntry {
  itemId: string;
  displayName: string;
  price: number;
  rarity: number;
  currency: "coins" | "cred";
  isLimited: boolean;
  dailyLimit: number | null;
  batchQuantity: number | null;
}

export const TRADER_NAMES: Record<TraderId, string> = {
  tian_wen: "Tian Wen",
  celeste: "Celeste",
  shani: "Shani",
  apollo: "Apollo",
  lance: "Lance",
};

export const TRADER_LISTINGS: Record<TraderId, TraderEntry[]> = {
  tian_wen: [
    {
      itemId: "light_ammo",
      displayName: "Light Ammo",
      price: 900,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: 25
    },
    {
      itemId: "medium_ammo",
      displayName: "Medium Ammo",
      price: 900,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: 20
    },
    {
      itemId: "heavy_ammo",
      displayName: "Heavy Ammo",
      price: 900,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: 10
    },
    {
      itemId: "shotgun_ammo",
      displayName: "Shotgun Ammo",
      price: 900,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: 5
    },
    {
      itemId: "launcher_ammo",
      displayName: "Launcher Ammo",
      price: 4500,
      rarity: 2,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: 6
    },
    {
      itemId: "energy_clip",
      displayName: "Energy Clip",
      price: 3000,
      rarity: 2,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "hairpin",
      displayName: "Hairpin I",
      price: 1350,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "stitcher",
      displayName: "Stitcher I",
      price: 2400,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "kettle",
      displayName: "Kettle I",
      price: 2520,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "ferro",
      displayName: "Ferro I",
      price: 1425,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "ferro",
      displayName: "Ferro IV",
      price: 8700,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "il_toro",
      displayName: "Il Toro I",
      price: 15000,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "burletta",
      displayName: "Burletta I",
      price: 8700,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "anvil",
      displayName: "Anvil I",
      price: 15000,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "renegade",
      displayName: "Renegade I",
      price: 21000,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "extended_light_mag_i",
      displayName: "Extended Light Mag I",
      price: 1920,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "extended_medium_mag_i",
      displayName: "Extended Medium Mag I",
      price: 1920,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "extended_shotgun_mag_i",
      displayName: "Extended Shotgun Mag I",
      price: 1920,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "muzzle_brake_i",
      displayName: "Muzzle Brake I",
      price: 1920,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "compensator_i",
      displayName: "Compensator I",
      price: 1920,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "shotgun_choke_i",
      displayName: "Shotgun Choke I",
      price: 1920,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "vertical_grip_i",
      displayName: "Vertical Grip I",
      price: 1920,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "angled_grip_i",
      displayName: "Angled Grip I",
      price: 1920,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "angled_grip_iii",
      displayName: "Angled Grip III",
      price: 15000,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "silencer_i",
      displayName: "Silencer I",
      price: 6000,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "shotgun_choke_ii",
      displayName: "Shotgun Choke II",
      price: 6000,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "extended_light_mag_ii",
      displayName: "Extended Light Mag II",
      price: 6000,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "stable_stock_ii",
      displayName: "Stable Stock II",
      price: 6000,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 2,
      batchQuantity: null
    },
    {
      itemId: "padded_stock",
      displayName: "Padded Stock",
      price: 15000,
      rarity: 3,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "hullcracker",
      displayName: "Hullcracker I",
      price: 30000,
      rarity: 3,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    }
  ],
  celeste: [
    {
      itemId: "metal_parts",
      displayName: "Metal Parts",
      price: 1,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "plastic_parts",
      displayName: "Plastic Parts",
      price: 1,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "rubber_parts",
      displayName: "Rubber Parts",
      price: 1,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "chemicals",
      displayName: "Chemicals",
      price: 1,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "fabric",
      displayName: "Fabric",
      price: 1,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "great_mullein",
      displayName: "Great Mullein",
      price: 5,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 10,
      batchQuantity: null
    },
    {
      itemId: "wires",
      displayName: "Wires",
      price: 4,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 10,
      batchQuantity: null
    },
    {
      itemId: "steel_spring",
      displayName: "Steel Spring",
      price: 6,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 10,
      batchQuantity: null
    },
    {
      itemId: "oil",
      displayName: "Oil",
      price: 6,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 10,
      batchQuantity: null
    },
    {
      itemId: "simple_gun_parts",
      displayName: "Simple Gun Parts",
      price: 7,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "battery",
      displayName: "Battery",
      price: 5,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 10,
      batchQuantity: null
    },
    {
      itemId: "canister",
      displayName: "Canister",
      price: 6,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 10,
      batchQuantity: null
    },
    {
      itemId: "magnet",
      displayName: "Magnet",
      price: 6,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 10,
      batchQuantity: null
    },
    {
      itemId: "duct_tape",
      displayName: "Duct Tape",
      price: 6,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 10,
      batchQuantity: null
    },
    {
      itemId: "rope",
      displayName: "Rope",
      price: 10,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "synthesized_fuel",
      displayName: "Synthesized Fuel",
      price: 14,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "syringe",
      displayName: "Syringe",
      price: 10,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "sensors",
      displayName: "Sensors",
      price: 10,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "heavy_gun_parts",
      displayName: "Heavy Gun Parts",
      price: 15,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "medium_gun_parts",
      displayName: "Medium Gun Parts",
      price: 15,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "light_gun_parts",
      displayName: "Light Gun Parts",
      price: 15,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "moss",
      displayName: "Moss",
      price: 10,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "speaker_component",
      displayName: "Speaker Component",
      price: 10,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "processor",
      displayName: "Processor",
      price: 10,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "voltage_converter",
      displayName: "Voltage Converter",
      price: 10,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "complex_gun_parts",
      displayName: "Complex Gun Parts",
      price: 60,
      rarity: 3,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "exodus_modules",
      displayName: "Exodus Modules",
      price: 55,
      rarity: 3,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    }
  ],
  shani: [
    {
      itemId: "binoculars",
      displayName: "Binoculars",
      price: 20,
      rarity: 0,
      currency: "cred",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "firecracker",
      displayName: "Firecracker",
      price: 20,
      rarity: 0,
      currency: "cred",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "blue_light_stick",
      displayName: "Blue Light Stick",
      price: 10,
      rarity: 0,
      currency: "cred",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "green_light_stick",
      displayName: "Green Light Stick",
      price: 10,
      rarity: 0,
      currency: "cred",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "red_light_stick",
      displayName: "Red Light Stick",
      price: 10,
      rarity: 0,
      currency: "cred",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "yellow_light_stick",
      displayName: "Yellow Light Stick",
      price: 10,
      rarity: 0,
      currency: "cred",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "recorder",
      displayName: "Recorder",
      price: 50,
      rarity: 1,
      currency: "cred",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "shaker",
      displayName: "Shaker",
      price: 40,
      rarity: 1,
      currency: "cred",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "acoustic_guitar",
      displayName: "Acoustic Guitar",
      price: 70,
      rarity: 4,
      currency: "cred",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "silencer_i",
      displayName: "Silencer I",
      price: 100,
      rarity: 1,
      currency: "cred",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "extended_light_mag_ii",
      displayName: "Extended Light Mag II",
      price: 100,
      rarity: 1,
      currency: "cred",
      isLimited: true,
      dailyLimit: 2,
      batchQuantity: null
    },
    {
      itemId: "extended_medium_mag_ii",
      displayName: "Extended Medium Mag II",
      price: 100,
      rarity: 1,
      currency: "cred",
      isLimited: true,
      dailyLimit: 2,
      batchQuantity: null
    },
    {
      itemId: "stable_stock_ii",
      displayName: "Stable Stock II",
      price: 100,
      rarity: 1,
      currency: "cred",
      isLimited: true,
      dailyLimit: 2,
      batchQuantity: null
    },
    {
      itemId: "angled_grip_ii",
      displayName: "Angled Grip II",
      price: 100,
      rarity: 1,
      currency: "cred",
      isLimited: true,
      dailyLimit: 2,
      batchQuantity: null
    },
    {
      itemId: "compensator_ii",
      displayName: "Compensator II",
      price: 100,
      rarity: 1,
      currency: "cred",
      isLimited: true,
      dailyLimit: 2,
      batchQuantity: null
    },
    {
      itemId: "raider_hatch_key",
      displayName: "Raider Hatch Key",
      price: 100,
      rarity: 2,
      currency: "cred",
      isLimited: true,
      dailyLimit: 2,
      batchQuantity: null
    },
    {
      itemId: "surge_shield_recharger",
      displayName: "Surge Shield Recharger",
      price: 40,
      rarity: 2,
      currency: "cred",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "sterilized_bandage",
      displayName: "Sterilized Bandage",
      price: 40,
      rarity: 2,
      currency: "cred",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "tactical_mk_2",
      displayName: "Tactical Mk. 2",
      price: 100,
      rarity: 2,
      currency: "cred",
      isLimited: true,
      dailyLimit: 2,
      batchQuantity: null
    },
    {
      itemId: "combat_mk_2",
      displayName: "Combat Mk. 2",
      price: 100,
      rarity: 2,
      currency: "cred",
      isLimited: true,
      dailyLimit: 2,
      batchQuantity: null
    },
    {
      itemId: "looting_mk_2",
      displayName: "Looting Mk. 2",
      price: 100,
      rarity: 2,
      currency: "cred",
      isLimited: true,
      dailyLimit: 2,
      batchQuantity: null
    },
    {
      itemId: "fireworks_box",
      displayName: "Fireworks Box",
      price: 60,
      rarity: 2,
      currency: "cred",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    }
  ],
  apollo: [
    {
      itemId: "blue_light_stick",
      displayName: "Blue Light Stick",
      price: 450,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "green_light_stick",
      displayName: "Green Light Stick",
      price: 450,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "red_light_stick",
      displayName: "Red Light Stick",
      price: 450,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "yellow_light_stick",
      displayName: "Yellow Light Stick",
      price: 450,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "remote_raider_flare",
      displayName: "Remote Raider Flare",
      price: 810,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "gas_grenade",
      displayName: "Gas Grenade",
      price: 810,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 6,
      batchQuantity: null
    },
    {
      itemId: "noisemaker",
      displayName: "Noisemaker",
      price: 1920,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 6,
      batchQuantity: null
    },
    {
      itemId: "door_blocker",
      displayName: "Door Blocker",
      price: 810,
      rarity: 0,
      currency: "coins",
      isLimited: true,
      dailyLimit: 6,
      batchQuantity: null
    },
    {
      itemId: "gas_mine",
      displayName: "Gas Mine",
      price: 810,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "light_impact_grenade",
      displayName: "Light Impact Grenade",
      price: 810,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "pulse_mine",
      displayName: "Pulse Mine",
      price: 1410,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 6,
      batchQuantity: null
    },
    {
      itemId: "seeker_grenade",
      displayName: "Seeker Grenade",
      price: 1920,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 6,
      batchQuantity: null
    },
    {
      itemId: "barricade_kit",
      displayName: "Barricade Kit",
      price: 1920,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 6,
      batchQuantity: null
    },
    {
      itemId: "recorder",
      displayName: "Recorder",
      price: 3000,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 6,
      batchQuantity: null
    },
    {
      itemId: "snap_blast_grenade",
      displayName: "Snap Blast Grenade",
      price: 2400,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "jolt_mine",
      displayName: "Jolt Mine",
      price: 2550,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "smoke_grenade",
      displayName: "Smoke Grenade",
      price: 3000,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 6,
      batchQuantity: null
    },
    {
      itemId: "zipline",
      displayName: "Zipline",
      price: 3000,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "trailblazer",
      displayName: "Trailblazer",
      price: 6600,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "deadline",
      displayName: "Deadline",
      price: 18000,
      rarity: 3,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    }
  ],
  lance: [
    {
      itemId: "looting_mk_1",
      displayName: "Looting Mk. 1",
      price: 1,
      rarity: 1,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "combat_mk_1",
      displayName: "Combat Mk. 1",
      price: 1,
      rarity: 1,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "tactical_mk_1",
      displayName: "Tactical Mk. 1",
      price: 1,
      rarity: 1,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "looting_mk_1",
      displayName: "Looting Mk. 1",
      price: 1920,
      rarity: 1,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "combat_mk_1",
      displayName: "Combat Mk. 1",
      price: 1920,
      rarity: 1,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "tactical_mk_1",
      displayName: "Tactical Mk. 1",
      price: 1920,
      rarity: 1,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "looting_mk_2",
      displayName: "Looting Mk. 2",
      price: 6000,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "combat_mk_2",
      displayName: "Combat Mk. 2",
      price: 6000,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "tactical_mk_2",
      displayName: "Tactical Mk. 2",
      price: 6000,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "bandage",
      displayName: "Bandage",
      price: 750,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "herbal_bandage",
      displayName: "Herbal Bandage",
      price: 2700,
      rarity: 1,
      currency: "coins",
      isLimited: true,
      dailyLimit: 10,
      batchQuantity: null
    },
    {
      itemId: "sterilized_bandage",
      displayName: "Sterilized Bandage",
      price: 6000,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "light_shield",
      displayName: "Light Shield",
      price: 1920,
      rarity: 1,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "medium_shield",
      displayName: "Medium Shield",
      price: 6000,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 3,
      batchQuantity: null
    },
    {
      itemId: "heavy_shield",
      displayName: "Heavy Shield",
      price: 16500,
      rarity: 3,
      currency: "coins",
      isLimited: true,
      dailyLimit: 1,
      batchQuantity: null
    },
    {
      itemId: "shield_recharger",
      displayName: "Shield Recharger",
      price: 1560,
      rarity: 1,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "surge_shield_recharger",
      displayName: "Surge Shield Recharger",
      price: 3600,
      rarity: 2,
      currency: "coins",
      isLimited: true,
      dailyLimit: 5,
      batchQuantity: null
    },
    {
      itemId: "defibrillator",
      displayName: "Defibrillator",
      price: 3000,
      rarity: 2,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    },
    {
      itemId: "adrenaline_shot",
      displayName: "Adrenaline Shot",
      price: 900,
      rarity: 0,
      currency: "coins",
      isLimited: false,
      dailyLimit: null,
      batchQuantity: null
    }
  ]
} as Record<TraderId, TraderEntry[]>;

/** Reverse index: for each itemId, list of (trader, listing). Direct sales only. */
export const ITEM_TRADERS: Record<string, { trader: TraderId; entry: TraderEntry }[]> = {};
for (const traderId of Object.keys(TRADER_LISTINGS) as TraderId[]) {
  for (const entry of TRADER_LISTINGS[traderId]) {
    if (!ITEM_TRADERS[entry.itemId]) ITEM_TRADERS[entry.itemId] = [];
    ITEM_TRADERS[entry.itemId].push({ trader: traderId, entry });
  }
}

/**
 * Indirect index: for each materialId NOT directly sold, find recyclable items
 * that yield it AND are sold by a trader. Used for "buy X, recycle into Y" hints.
 */
export interface IndirectSource {
  trader: TraderId;
  sourceItem: GameItem;
  entry: TraderEntry;
  yieldPerUnit: number;
}

export const INDIRECT_TRADER_SOURCES: Record<string, IndirectSource[]> = {};
for (const matId of Object.keys(RECYCLE_SOURCES)) {
  // Skip if directly sold — we'll show that first
  if (ITEM_TRADERS[matId]?.length) continue;
  for (const { item: src, yieldPerUnit } of RECYCLE_SOURCES[matId]) {
    const traders = ITEM_TRADERS[src.id] ?? [];
    for (const { trader, entry } of traders) {
      if (!INDIRECT_TRADER_SOURCES[matId]) INDIRECT_TRADER_SOURCES[matId] = [];
      INDIRECT_TRADER_SOURCES[matId].push({ trader, sourceItem: src, entry, yieldPerUnit });
    }
  }
}

/** True if a material is obtainable through any trader (direct or indirect). */
export function isTraderBuyable(matId: string): boolean {
  return !!(ITEM_TRADERS[matId]?.length || INDIRECT_TRADER_SOURCES[matId]?.length);
}
