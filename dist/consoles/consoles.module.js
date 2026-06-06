"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsolesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const console_entity_1 = require("./console.entity");
const consoles_service_1 = require("./consoles.service");
const consoles_controller_1 = require("./consoles.controller");
let ConsolesModule = class ConsolesModule {
};
exports.ConsolesModule = ConsolesModule;
exports.ConsolesModule = ConsolesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([console_entity_1.Console])],
        providers: [consoles_service_1.ConsolesService],
        controllers: [consoles_controller_1.ConsolesController],
        exports: [consoles_service_1.ConsolesService],
    })
], ConsolesModule);
//# sourceMappingURL=consoles.module.js.map