import { seed as teamSeed } from './seeders/team.seed';
import { seed as userSeed } from './seeders/user.seed';
import { seed as cardSeed } from './seeders/card.seed';
import { seed as approverSeed } from './seeders/approver.seed';
import { seed as approverRequestSeed } from './seeders/approver-request.seed';
import { seed as policySeed } from './seeders/policy.seed';
import { seed as transactionSeed } from './seeders/transaction.seed';
import { seed as conditionSeed } from './seeders/condition.seed';

const seed = async () => {
    await teamSeed();
    await userSeed();
    await cardSeed();
    await transactionSeed();
    await policySeed();
    await approverSeed();
    await approverRequestSeed();
    await conditionSeed();
};

seed().then(() =>  {console.log("Seeding completed")});


