<?php

use App\Jobs\FreeMonthlyTokens;
use App\Jobs\SetInvoicesOverdue;
use App\Jobs\CleanupOldDemoUsers;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new SetInvoicesOverdue)->dailyAt('00:10');
Schedule::job(new FreeMonthlyTokens)->monthlyOn(1, '00:15');
Schedule::job(new CleanupOldDemoUsers)->dailyAt('00:20');
